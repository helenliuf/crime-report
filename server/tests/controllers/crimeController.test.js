const CrimeReport = require("../../models/CrimeReport"); 
const { getAllCrimes } = require("../../controllers/crimeController");
const httpMocks = require("node-mocks-http");

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

describe("getAllCrimes function", () => {
  let mongoServer;

  beforeAll(async () => {
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
      await mongoose.connection.close();
      await mongoServer.stop();
  });

  beforeEach(async () => {
      await CrimeReport.deleteMany(); // clear the collection before each test
  });

  it("should return all crimes", async () => {

      // declare dummy crimes
      const crime1 = new CrimeReport({
          location: { type: "Point", coordinates: [-71.0765, 42.3554] },
          userId: "67eb6b2f551fd82eaa773b3c",
          description: "Vandalism reported near the school.",
          status: "Resolved",
      });

      const crime2 = new CrimeReport({
          location: { type: "Point", coordinates: [-71.0565, 42.4554] },
          userId: "67eb6b2f551fd82eaa773b3c",
          description: "House Robbery.",
          status: "Verified",
      });

      const crime3 = new CrimeReport({
          location: { type: "Point", coordinates: [-71.1565, 42.4553] },
          userId: "67eb6b2f551fd82eaa773b3c",
          description: "Hit and Run.",
          status: "Verified",
      });

      // add dummy crimes to mock collection
      await CrimeReport.insertMany([crime1, crime2, crime3]);

      // getAllCrimes req and res
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      await getAllCrimes(req, res);

      const responseData = res._getJSONData();
      //console.log(responseData);

      // verify status, length of response array, and correct crimes
      expect(res.statusCode).toBe(200);
      expect(responseData).toHaveLength(3);
      expect(responseData).toEqual(
          expect.arrayContaining([
              expect.objectContaining({ description: "Vandalism reported near the school." }),
              expect.objectContaining({ description: "House Robbery." }),
              expect.objectContaining({ description: "Hit and Run." }),
      ]));

  }, 20000);

  it("should return empty array if there are 0 crimes", async () => {
      // do not add anything to mock collection -- 0 crimes

      // getAllCrimes req and res
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      await getAllCrimes(req, res);

      const responseData = res._getJSONData();
      //console.log(responseData);

      // verify status and length of response array
      expect(res.statusCode).toBe(200);
      expect(responseData).toHaveLength(0);

  }, 20000);

  it("should handle errors and return error message", async () => {
      // mock an error response
      jest.spyOn(CrimeReport, "find").mockImplementationOnce(() => {
          throw new Error("Database error");
      });

      // getAllCrimes req and res
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      await getAllCrimes(req, res);

      // check status and error msg
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({
          message: "Error fetching crimes",
          error: expect.any(Object),
      });

      // restore original model
      CrimeReport.find.mockRestore();

  }, 20000);
});
