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

    const createdCategoryPromises = await Promise.all(createCategories);

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

    // Template for seeding
    const eventTemplates = [
      //  Music
      {
        name: "Indie Rock Night ft. The Wandering Souls",
        description:
          "Join us for a night of electrifying performances as The Wandering Souls take the stage. Experience the raw energy and poetic lyrics that have made them an indie sensation.",
        categoryName: "Music",
      },
      {
        name: "Sunset Jazz Fusion in the Park",
        description:
          "Relax and unwind with the smooth sounds of live jazz as the sun sets. Bring a blanket and enjoy an evening of incredible musicianship in a beautiful park setting.",
        categoryName: "Music",
      },
      {
        name: "Warehouse EDM Party: Sector 7-G",
        description:
          "Prepare for a high-energy night of electronic dance music with top local DJs. State-of-the-art sound and light show guaranteed.",
        categoryName: "Music",
      },
      {
        name: "Acoustic Showcase & Open Mic",
        description:
          "Discover the next big singer-songwriter or share your own talent. A cozy and supportive atmosphere for all music lovers.",
        categoryName: "Music",
      },
      {
        name: "Classical Strings by Candlelight",
        description:
          "Experience the timeless beauty of classical masterpieces performed by a string quartet in a magical, candlelit setting.",
        categoryName: "Music",
      },

      // Art & Culture
      {
        name: "Metropolis: A Modern Art Exhibit",
        description:
          "Explore the dynamic relationship between urban life and modern art. Featuring works from over 30 contemporary artists.",
        categoryName: "Art & Culture",
      },
      {
        name: "Interactive Digital Art Installation",
        description:
          "Step into a world of light and code. This immersive experience allows you to become part of the art itself.",
        categoryName: "Art & Culture",
      },
      {
        name: "Historical Downtown Walking Tour",
        description:
          "Uncover the hidden stories and architectural gems of our city's historic downtown district with an expert guide.",
        categoryName: "Art & Culture",
      },
      {
        name: "Poetry Slam & Spoken Word Night",
        description:
          "A powerful evening of expression, emotion, and creativity. Come to listen or sign up to perform.",
        categoryName: "Art & Culture",
      },

      // Food & Drink
      {
        name: "Gourmet Street Food Festival",
        description:
          "Taste the world in one place! Dozens of food trucks and stalls offering gourmet bites and international flavors.",
        categoryName: "Food & Drink",
      },
      {
        name: "Artisanal Cocktail Crafting Workshop",
        description:
          "Learn the secrets of mixology from a master bartender. You'll learn to craft three signature cocktails and take home the recipes.",
        categoryName: "Food & Drink",
      },
      {
        name: "Farm-to-Table Dinner Experience",
        description:
          "Enjoy a seasonal, multi-course meal prepared with fresh, locally sourced ingredients by a renowned chef.",
        categoryName: "Food & Drink",
      },
      {
        name: "Coffee Tasting & Brewing Class",
        description:
          "Explore the world of specialty coffee. Learn different brewing methods and taste unique single-origin beans.",
        categoryName: "Food & Drink",
      },

      // Tech
      {
        name: "AI & The Future of Design Conference",
        description:
          "A full-day conference exploring the intersection of artificial intelligence and creative design. Featuring talks from industry leaders.",
        categoryName: "Tech",
      },
      {
        name: "Introduction to Web3 & Blockchain",
        description:
          "A beginner-friendly workshop demystifying the world of blockchain, cryptocurrencies, and decentralized applications.",
        categoryName: "Tech",
      },
      {
        name: "Indie Game Developer Meetup",
        description:
          "Connect with fellow game developers, showcase your projects, and network with industry professionals.",
        categoryName: "Tech",
      },
      {
        name: "Cybersecurity Summit 2025",
        description:
          "Stay ahead of the curve with the latest trends and threats in cybersecurity. A must-attend for IT professionals.",
        categoryName: "Tech",
      },

      //  Health
      {
        name: "Sunrise Rooftop Yoga & Meditation",
        description:
          "Start your day with an energizing yoga flow and guided meditation, all while enjoying breathtaking city views.",
        categoryName: "Health",
      },
      {
        name: "Mindfulness and Stress Reduction Workshop",
        description:
          "Learn practical techniques to manage stress, improve focus, and cultivate a sense of inner calm in your daily life.",
        categoryName: "Health",
      },
      {
        name: "Healthy Cooking & Meal Prep Class",
        description:
          "Discover how to make delicious and nutritious meals that are easy to prepare for a busy week.",
        categoryName: "Health",
      },
      {
        name: "Guided Nature Hike & Forest Bathing",
        description:
          "Reconnect with nature on a scenic guided hike. Experience the calming practice of 'forest bathing'.",
        categoryName: "Health",
      },

      // Sports
      {
        name: "Community 5K Charity Run",
        description:
          "Run for a good cause! A fun and friendly 5K race for all fitness levels, with proceeds benefiting local charities.",
        categoryName: "Sports",
      },
      {
        name: "Beach Volleyball Tournament",
        description:
          "Get your team together for a day of sun, sand, and spikes. All skill levels are welcome to compete.",
        categoryName: "Sports",
      },
      {
        name: "Rock Climbing & Bouldering Intro Class",
        description:
          "Learn the basics of rock climbing in a safe and supportive environment with certified instructors.",
        categoryName: "Sports",
      },
      {
        name: "Live Soccer Match: City FC vs Rovers",
        description:
          "Experience the thrill of a live professional soccer match. A great night out for the whole family.",
        categoryName: "Sports",
      },
    ];

    const categoryMap = new Map(
      createdCategoryPromises.map((category) => [category.id, category.name])
    );

    const organizers = await prisma.organizer.findMany();
    console.log("Organizers : ", organizers);
    const location = await prisma.event_Location.findMany();
    const oneDayInMilis = 86400000;

    for (let index = 0; index < 10; index++) {
      const selectedOrganizer = faker.helpers.arrayElement(organizers);
      const selectedLocation = faker.helpers.arrayElement(location);
      // const selectedCategory = faker.helpers.arrayElement(createdCategoryPromises);
      const selectedEventTemplate = faker.helpers.arrayElement(eventTemplates);
      console.log(selectedEventTemplate);
      const categoryId = categoryMap.get(selectedEventTemplate.categoryName);
      const event_name = selectedEventTemplate.name;
      const event_description = selectedEventTemplate.description;
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
          event_category_id: categoryId as string,
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
