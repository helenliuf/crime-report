const CrimeReport = require("../../models/CrimeReport"); 
const { getAllCrimes, getCrimeById, addCrimeReport, getNearbyCrimes } = require("../../controllers/crimeController");
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

describe("getCrimeById function", () => {
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

  it("should correctly return 1 crime by id", async () => {
      // declare dummy crime
      const crime1 = new CrimeReport({
          location: { type: "Point", coordinates: [-71.0765, 42.3554] },
          userId: "67eb6b2f551fd82eaa773b3c",
          description: "Vandalism reported near the school.",
          status: "Resolved",
      });

      await crime1.save();

      // get _id of crime
      const crimeId = crime1._id.toString();

      // getCrimeById with mock request and response
      const req = httpMocks.createRequest({
          params: { id: crimeId },
      });
      const res = httpMocks.createResponse();

      await getCrimeById(req, res);

      // assertions for status and correct crime retrieved
      const responseData = res._getJSONData();

      expect(res.statusCode).toBe(200);
      expect(responseData).toEqual(
          expect.objectContaining({
              _id: crimeId,
              description: "Vandalism reported near the school.",
              status: "Resolved",
          })
      );
  }, 20000);

  it("should correctly return 1 crime by id out of many", async () => {
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

      const crimeId = crime1._id.toString();

      // getCrimeById with mock request and response
      const req = httpMocks.createRequest({
          params: { id: crimeId },
      });
      const res = httpMocks.createResponse();

      await getCrimeById(req, res);

      // assertions for status and correct crime retrieved
      const responseData = res._getJSONData();
      console.log(responseData);

      expect(res.statusCode).toBe(200);
      expect(responseData).toEqual(
          expect.objectContaining({
              _id: crimeId,
              description: "Vandalism reported near the school.",
              status: "Resolved",
          })
      );

  }, 20000);

  it("should return 404 if crime not found", async () => {
      // do not add anything to mock collection -- 0 crimes

      // mock response and request for getCrimeById
      const req = httpMocks.createRequest({
          params: { id: "67eb6b2f551fd82eaa773b3c" },
      });
      const res = httpMocks.createResponse();

      await getCrimeById(req, res);

      // assertions for status and correct error message
      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual({
          message: "Crime not found",
      });

  }, 20000);

  it("should handle errors and return 500 status", async () => {
      // do not add anything to mock collection -- 0 crimes

      // mock response and request for getCrimeById
      const req = httpMocks.createRequest({
          params: { id: "10" },
      });
      const res = httpMocks.createResponse();

      await getCrimeById(req, res);

      // assertions for 500 error code and error message
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({
          message: "Error fetching crime",
          error: expect.any(Object)
      });
  });

});

describe("addCrimeReport function", () => {
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

  it("should correctly add a new report", async () => {
    // create request with body containing crime to add
    const req = httpMocks.createRequest({
      body: {
        userId: "67eb068de7c90f14553d931d",
        description: "Suspicious activity reported near the park.",
        location: {
            coordinates: [-71.0589, 42.3601]
        },
        status: "Pending",
      }
    });

    const res = httpMocks.createResponse();

    // addCrimeReport req and res
    await addCrimeReport(req, res);

    const responseData = res._getJSONData();

    // assertions for status code and correct response containing crime
    expect(res.statusCode).toBe(201);
    expect(responseData).toEqual(
        expect.objectContaining({
          userId: "67eb068de7c90f14553d931d",
          description: "Suspicious activity reported near the park.",
          status: "Pending",
        })
    );

    // assertions checking crime quantity in mock model
    const res_check = httpMocks.createResponse();
    const req_check = httpMocks.createRequest();

    await getAllCrimes(req_check, res_check);

    const responseCheckData = res_check._getJSONData();

    expect(res_check.statusCode).toBe(200);
    expect(responseCheckData).toHaveLength(1);

  }, 20000);

});

describe("getNearbyCrimes function", () => {
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

  it("should correctly return nearby crimes", async () => {
    // dummy crimes
    const crime1 = new CrimeReport({
      location: { type: "Point", coordinates: [-71.0589, 42.3601] },
      userId: "67eb6b2f551fd82eaa773b3c",
      description: "Theft reported near the mall.",
      status: "Pending",
    });

    const crime2 = new CrimeReport({
        location: { type: "Point", coordinates: [-71.0590, 42.3610] },
        userId: "67eb6b2f551fd82eaa773b3c",
        description: "Assault reported in the alley.",
        status: "Verified",
    });

    await CrimeReport.insertMany([crime1, crime2]);

    // mock request and response and getNearbyCrimes call
    const req = httpMocks.createRequest({
        query: { latitude: 42.3601, longitude: -71.0589, radius: 1 },
    });
    const res = httpMocks.createResponse();

    await getNearbyCrimes(req, res);

    // assertions for status, num of crimes returned, and correct crimes
    const responseData = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(responseData.length).toBeGreaterThan(0);
    expect(responseData).toEqual(
        expect.arrayContaining([
            expect.objectContaining({ description: "Theft reported near the mall." }),
            expect.objectContaining({ description: "Assault reported in the alley." }),
        ])
    );
  });

  it("should correctly throw 400 error if missing params", async () => {
    // mock request without query params and getNearbyCrimes call
    const req = httpMocks.createRequest({ query: {} });
    const res = httpMocks.createResponse();

    await getNearbyCrimes(req, res);

    // verify 400 status and error message
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
        message: "Latitude, longitude, and radius are required",
    });
  });

  it("should correctly handle 500 error", async () => {
    // mock error in retrieval
    jest.spyOn(CrimeReport, "find").mockImplementationOnce(() => {
      throw new Error("Database query failed");
    });

    // mock req and response and getNearbyCrimes call
    const req = httpMocks.createRequest({
        query: { latitude: 42.3601, longitude: -71.0589, radius: 1 },
    });
    const res = httpMocks.createResponse();

    await getNearbyCrimes(req, res);

    // assertions for 500 status and error message
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({
        message: "Error fetching nearby crimes",
        error: expect.any(Object),
    });
  });


});
