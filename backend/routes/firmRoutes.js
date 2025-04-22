const express = require("express");
const multer = require("multer");
const path = require("path");
const Firm = require("../models/Firm");

const router = express.Router();
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post("/", upload.single("logo"), async (req, res) => {
  try {
    const { firmName, shopAddress, mobileNumber, billTitle, tagline } =
      req.body;
    const logoUrl = req.file ? `/uploads/${req.file.filename}` : "";

    let firm = await Firm.findOne();
    if (firm) {
      firm.firmName = firmName;
      firm.shopAddress = shopAddress;
      firm.mobileNumber = mobileNumber;
      firm.logo = logoUrl || firm.logo;
      firm.billTitle = billTitle;
      firm.tagline = tagline;
    } else {
      firm = new Firm({
        firmName,
        shopAddress,
        mobileNumber,
        logo: logoUrl,
        billTitle,
        tagline,
      });
    }

    await firm.save();
    res.json({ success: true, message: "Firm details saved!", firm });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router.get("/", async (req, res) => {
  try {
    const firm = await Firm.findOne();
    res.json(firm);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
