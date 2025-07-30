import { faker } from "@faker-js/faker";
import { prisma } from "../src/config/prisma";

async function seed() {
  try {
    console.info("Start seeding dummy data ...");
    console.info("Delete all previous data ...");
    await prisma.users.deleteMany();
    // await prisma.events.deleteMany();
    await prisma.organizer.deleteMany();

    const categories = [
      "Music",
      "Art & Culture",
      "Food & Drink",
      "Tech",
      "Health",
      "Sports",
    ];

    const createCategories = categories.map((name) =>
      prisma.event_Category.create({ data: { name } })
    );

    const createdPromises = await Promise.all(createCategories);

    // Create Users Data
    for (let i = 0; i < 10; i++) {
      const first_name = faker.person.firstName();
      const last_name = faker.person.lastName();
      const email = faker.internet.email();
      const password = faker.internet.password();
      const country = faker.location.country();
      const birthdate = faker.date.birthdate();
      const phone_number = faker.phone.number({ style: "international" });
      const avatar = faker.image.avatar();

      const users = await prisma.users.create({
        data: {
          first_name,
          last_name,
          email,
          password,
          country,
          birthdate,
          phone_number,
          avatar,
        },
      });

      console.info(`Create Data ${users.first_name} ${users.last_name}`);
    }

    // Create Organizer
    const users = await prisma.users.findMany();

    const organizerCount = faker.number.int({ min: 1, max: users.length });

    const randomizeUser = faker.helpers.shuffle(users);
    const selectedOrganizers = randomizeUser.splice(0, organizerCount);

    for (const users of selectedOrganizers) {
      await prisma.organizer.create({
        data: { user_id: users.id },
      });
    }

    // Create event location - start

    const city = [
      "Ardenleigh",
      "Stoneford",
      "Bridgemont",
      "Lakeshore",
      "Halcyon City",
    ];

    for (let index = 0; index < 10; index++) {
      const address = faker.location.streetAddress();
      const randomCity = faker.helpers.arrayElement(city);
      await prisma.event_Location.create({
        data: { address, city: randomCity, event_id: "test" },
      });
    }

    //

    // Create Event

    const organizers = await prisma.organizer.findMany();
    console.log("Organizers : ", organizers);
    const location = await prisma.event_Location.findMany();

    for (let index = 0; index < 10; index++) {
      const oneDayInMilis = 86400000;
      const selectedOrganizer = faker.helpers.arrayElement(organizers);
      const selectedLocation = faker.helpers.arrayElement(location);
      const selectedCategory = faker.helpers.arrayElement(createdPromises);
      console.log(selectedCategory);
      const event_name = faker.lorem.sentence();
      const event_description = faker.lorem.text();
      const event_price = faker.number.int({ min: 100000, max: 400000 });
      const event_startDate = faker.date.between({
        from: new Date("2025-01-01"),
        to: new Date("2026-01-01"),
      });
      let event_endDate;
      if (Math.floor(Math.random() * 2) == 1 && event_startDate) {
        event_endDate = new Date(
          event_startDate.getTime() +
            oneDayInMilis * Math.floor(Math.random() * 3 + 1)
        );
      }
      const event_image = faker.image.urlPicsumPhotos();
      console.log(event_image);
      await prisma.events.create({
        data: {
          event_category_id: selectedCategory.id,
          event_location_id: selectedLocation.id,
          organizer_id: selectedOrganizer.id,
          name: event_name,
          description: event_description,
          price: event_price,
          start_date: event_startDate,
          end_date: event_endDate,
          image: event_image,
        },
      });
    }

    //

    console.info(`\n Create All Dummy Data Success ✅`);
  } catch (error) {
    console.info(`Create Dummy Data Failed: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
