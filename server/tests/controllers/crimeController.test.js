const CrimeReport = require("../../models/CrimeReport"); 
const { getAllCrimes } = require("../../controllers/crimeController");
const httpMocks = require("node-mocks-http");

jest.mock("../../models/CrimeReport"); // mock the crimereport model

describe("getAllCrimes function", () => {
  it("should return all crimes with status 200", async () => {
    const mockCrimes = [
      {
          "location": {
              "type": "Point",
              "coordinates": [
                  -71.0765,
                  42.3554
              ]
          },
          "_id": "67eb6bca5950d8d74c340c51",
          "userId": "67eb6b2f551fd82eaa773b3c",
          "description": "Vandalism reported near the school.",
          "status": "Resolved",
          "createdAt": "2025-04-01T04:30:02.004Z",
          "__v": 0
      },
      {
          "location": {
              "type": "Point",
              "coordinates": [
                  -71.0565,
                  42.4554
              ]
          },
          "_id": "67eb6bf45950d8d74c340c53",
          "userId": "67eb6b2f551fd82eaa773b3c",
          "description": "House Robbery.",
          "status": "Verified",
          "createdAt": "2025-04-01T04:30:44.088Z",
          "__v": 0
      },
      {
          "location": {
              "type": "Point",
              "coordinates": [
                  -71.1565,
                  42.4553
              ]
          },
          "_id": "67eb6c065950d8d74c340c55",
          "userId": "67eb6b2f551fd82eaa773b3c",
          "description": "Hit and Run.",
          "status": "Verified",
          "createdAt": "2025-04-01T04:31:02.849Z",
          "__v": 0
      }
  ]
    
    CrimeReport.find.mockResolvedValue(mockCrimes); // mock mongoDB response

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    
    await getAllCrimes(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockCrimes);
    expect(CrimeReport.find).toHaveBeenCalledTimes(1);
  });

  it("should handle errors and return status 500", async () => {
    CrimeReport.find.mockRejectedValue(new Error("Database error"));

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    await getAllCrimes(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toHaveProperty("message", "Error fetching crimes");
  });
});
