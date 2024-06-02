import { validate } from 'class-validator';
import { FlightDetails, ModelFeatures } from './flightDetails';

describe('DTOs', () => {
  describe('FlightDetails', () => {
    it('should validate a valid FlightDetails object', async () => {
      const flightDetails = new FlightDetails();
      flightDetails.searchDate = '2022-12-20';
      flightDetails.flightDate = '2022-12-25';
      flightDetails.departureHour = 10;
      flightDetails.departureMinute = 0;
      flightDetails.arrivalHour = 12;
      flightDetails.arrivalMinute = 30;

      const errors = await validate(flightDetails);
      expect(errors.length).toBe(0);
    });

    it('should not validate an invalid FlightDetails object', async () => {
      const flightDetails = new FlightDetails();
      flightDetails.searchDate = 'invalid-date';
      flightDetails.flightDate = '';
      flightDetails.departureHour = null;
      flightDetails.departureMinute = -1;
      flightDetails.arrivalHour = 25;
      flightDetails.arrivalMinute = 60;

      const errors = await validate(flightDetails);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('ModelFeatures', () => {
    it('should validate a valid ModelFeatures object', async () => {
      const modelFeatures = new ModelFeatures();
      modelFeatures.flightDay = 25;
      modelFeatures.flightMonth = 12;
      modelFeatures.departureHour = 10;
      modelFeatures.departureMinute = 0;
      modelFeatures.arrivalHour = 12;
      modelFeatures.arrivalMinute = 30;
      modelFeatures.daysBeforeFlight = 5;
      modelFeatures.flightDayOfWeek = 0;
      modelFeatures.travelDurationMinutes = 150;
      modelFeatures.nearHoliday = true;

      const errors = await validate(modelFeatures);
      expect(errors.length).toBe(0);
    });

    it('should not validate an invalid ModelFeatures object', async () => {
      const modelFeatures = new ModelFeatures();
      modelFeatures.flightDay = -1;
      modelFeatures.flightMonth = 13;
      modelFeatures.departureHour = 24;
      modelFeatures.departureMinute = 60;
      modelFeatures.arrivalHour = 25;
      modelFeatures.arrivalMinute = -1;
      modelFeatures.daysBeforeFlight = null;
      modelFeatures.flightDayOfWeek = 8;
      modelFeatures.travelDurationMinutes = -100;
      modelFeatures.nearHoliday = null;

      const errors = await validate(modelFeatures);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
