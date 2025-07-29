import { faker } from "@faker-js/faker";
import { prisma } from "../src/config/prisma";

async function seed() {
  try {
    console.info("Start seeding dummy data ...");
    console.info("Delete all previous data ...");
    await prisma.users.deleteMany();
    // await prisma.events.deleteMany();
    await prisma.organizer.deleteMany();

    // Eky --start
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
    //Eky --end

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

    // Create Events - Eky - start

    const event_name = faker.lorem.sentence();
    const event_description = faker.lorem.text();
    const event_price = faker.number.int({ min: 10, max: 300 });
    const event_startDate = faker.date.between({
      from: new Date("2025-01-01"),
      to: new Date("2026-01-01"),
    });
    const oneDayInMilis = 86400000;
    let event_endDate;
    if (Math.floor(Math.random() * 2) == 1 && event_startDate) {
      event_endDate = new Date(
        event_startDate.getTime() +
          oneDayInMilis * Math.floor(Math.random() * 3 + 1)
      );
    }

    // Eky - end

    // Create Event Locations
    // const city = faker.location.city();
    // const address = faker.location.streetAddress();

    // for(let i = 0; i<users.length;i++){
    //   await prisma.events.create({
    //     data:{
    //       user
    //     }
    //   })

    // }

    console.info(`\n Create All Dummy Data Success ✅`);
  } catch (error) {
    console.info(`Create Dummy Data Failed: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
