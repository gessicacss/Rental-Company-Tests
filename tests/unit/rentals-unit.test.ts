import { faker } from "@faker-js/faker";
import rentalsRepository from "../../src/repositories/rentals-repository";
import usersRepository from "../../src/repositories/users-repository";
import rentalsService, {
  RENTAL_LIMITATIONS,
} from "../../src/services/rentals-service";
import moviesRepository from "../../src/repositories/movies-repository";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Rentals Service Unit Tests", () => {
  it("should return all rentals", async () => {
    jest.spyOn(rentalsRepository, "getRentals").mockResolvedValueOnce([
      {
        id: 1,
        date: new Date(),
        endDate: new Date(),
        userId: 1,
        closed: false,
      },
      {
        id: 2,
        date: new Date(),
        endDate: new Date(),
        userId: 1,
        closed: false,
      },
    ]);
    const rentals = await rentalsService.getRentals();
    expect(rentals).toHaveLength(2);
    expect(rentals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          closed: expect.any(Boolean),
          date: expect.any(Date),
          endDate: expect.any(Date),
          id: expect.any(Number),
          userId: expect.any(Number),
        }),
      ])
    );
  });

  it("should return rental by id", async () => {
    jest.spyOn(rentalsRepository, "getRentalById").mockResolvedValueOnce({
      id: 1,
      date: new Date(),
      endDate: new Date(),
      userId: 1,
      closed: false,
      movies: [],
    });
    const rentals = await rentalsService.getRentalById(1);
    expect(rentals).toEqual({
      closed: expect.any(Boolean),
      date: expect.any(Date),
      endDate: expect.any(Date),
      id: 1,
      movies: expect.any(Array),
      userId: 1,
    });
  });

  it("should create a rental", async () => {
    const user = {
      id: 1,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      cpf: faker.internet.ipv4().replace(/\.$/g, ""),
      birthDate: faker.date.birthdate(),
    };

    const movie = {
      id: 1,
      name: "Movie 1",
      adultsOnly: false,
      rentalId: null,
    };

    jest.spyOn(usersRepository, "getById").mockResolvedValueOnce(user);
    jest.spyOn(moviesRepository, "getById").mockResolvedValueOnce(movie);

    const rentalInfo = {
      id: 1, 
      closed: false,
      date: new Date(),
      endDate: new Date(),
      movies: [movie],
      moviesId: [movie.id],
      userId: user.id,
    };

    jest
      .spyOn(rentalsRepository, "createRental")
      .mockImplementationOnce((): any => {
        return rentalInfo;
      });
    const createdRental = await rentalsService.createRental(rentalInfo);
    expect(createdRental).toEqual(rentalInfo);
  });
});
