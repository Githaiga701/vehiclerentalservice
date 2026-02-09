import { faker } from '@faker-js/faker';

export const userFactory = (overrides: Partial<any> = {}) => {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number('07########'),
    role: 'RENTER',
    password: 'password123',
    isActive: true,
    ...overrides,
  };
};

export const vehicleFactory = (overrides: Partial<any> = {}) => ({
  id: faker.string.uuid(),
  ownerId: faker.string.uuid(),
  title: `${faker.vehicle.manufacturer()} ${faker.vehicle.model()}`,
  make: faker.vehicle.manufacturer(),
  model: faker.vehicle.model(),
  year: 2018,
  category: 'SUV',
  dailyPrice: 3000,
  location: faker.location.city(),
  isAvailable: true,
  status: 'APPROVED',
  ...overrides,
});

export const bookingFactory = (overrides: Partial<any> = {}) => ({
  id: faker.string.uuid(),
  renterId: faker.string.uuid(),
  vehicleId: faker.string.uuid(),
  ownerId: faker.string.uuid(),
  status: 'PENDING',
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 86400000).toISOString(),
  totalPrice: 3000,
  ...overrides,
});
