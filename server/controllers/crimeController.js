const CrimeReport = require("../models/CrimeReport");

const getAllCrimes = async (req, res) => {
	try {
		const crimes = await CrimeReport.find();
		res.status(200).json(crimes);
	} catch (error) {
		res.status(500).json({ message: "Error fetching crimes", error });
	}
};

const getCrimeById = async (req, res) => {
	try {
		const { id } = req.params;
		const crime = await CrimeReport.findById(id);
		if (!crime) {
			return res.status(404).json({ message: "Crime not found" });
		}
		res.status(200).json(crime);
	} catch (error) {
		res.status(500).json({ message: "Error fetching crime", error });
	}
};

const getNearbyCrimes = async (req, res) => {
    try {
        const { latitude, longitude, radius } = req.query;

        if (!latitude || !longitude || !radius) {
            return res.status(400).json({
                message: "Latitude, longitude, and radius are required",
            });
        }
		const radiusInRadians = radius / 3963.2; // Convert miles to radians
        const crimes = await CrimeReport.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[longitude, latitude], radiusInRadians],
                },
            },
        });

        res.status(200).json(crimes);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error fetching nearby crimes",
            error,
        });
    }
};

const addCrimeReport = async (req, res) => {
    try {
        const { userId, description, location, status } = req.body;

        const newCrime = new CrimeReport({
            userId,
            description,
            location: {
                type: "Point",
                coordinates: location.coordinates, // [longitude, latitude]
            },
            status,
        });

        const savedCrime = await newCrime.save();
        res.status(201).json(savedCrime);
    } catch (error) {
        res.status(400).json({ message: "Error adding crime report", error });
    }
};



module.exports = {
	getAllCrimes,
	getCrimeById,
	addCrimeReport,
    getNearbyCrimes,
};
