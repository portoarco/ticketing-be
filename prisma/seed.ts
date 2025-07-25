import { faker } from "@faker-js/faker";
import { prisma } from "../src/config/prisma";

async function seed() {
  try {
    console.info("Start seeding dummy data ...");
    console.info("Delete all previous data ...");
    await prisma.users.deleteMany();
    // await prisma.events.deleteMany();
    await prisma.organizer.deleteMany();

    // Create Users Data
    for (let i = 0; i < 10; i++) {
      const name = faker.person.fullName();
      const email = faker.internet.email();
      const password = faker.internet.password();
      const country = faker.location.country();
      const birthdate = faker.date.birthdate();
      const phone_number = faker.phone.number({ style: "international" });
      const avatar = faker.image.avatar();

      const users = await prisma.users.create({
        data: {
          name,
          email,
          password,
          country,
          birthdate,
          phone_number,
          avatar,
        },
      });

      console.info(`Create Data ${users.name}`);
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

    console.info(`\n Create All Dummy Data Success ✅`);
  } catch (error) {
    console.info(`Create Dummy Data Failed: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
