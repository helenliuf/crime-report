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


module.exports = {
	getAllCrimes,
	getCrimeById,
};
