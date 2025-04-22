const Firm = require('../models/Firm');
const fs = require('fs');
const path = require('path');

// @desc    Get firm details
// @route   GET /api/firm
// @access  Public
exports.getFirm = async (req, res) => {
  try {
    const firm = await Firm.findOne();
    res.json(firm);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create or Update firm details
// @route   POST /api/firm
// @access  Public
exports.createOrUpdateFirm = async (req, res) => {
  try {
    let firmData = {
      shopName: req.body.shopName,
      shopAddress: req.body.shopAddress,
      shopMobile: req.body.shopMobile,
      billTitle: req.body.billTitle,
      tagline: req.body.tagline
    };

    if (req.file) {
      firmData.shopLogo = `/uploads/${req.file.filename}`;
      
      // If updating, delete old image
      const existingFirm = await Firm.findOne();
      if (existingFirm && existingFirm.shopLogo) {
        const oldImagePath = path.join(__dirname, '..', existingFirm.shopLogo);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    let firm;
    const existingFirm = await Firm.findOne();
    
    if (existingFirm) {
      firm = await Firm.findByIdAndUpdate(existingFirm._id, firmData, { new: true });
    } else {
      firm = new Firm(firmData);
      await firm.save();
    }

    res.json(firm);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete firm
// @route   DELETE /api/firm/:id
// @access  Public
exports.deleteFirm = async (req, res) => {
  try {
    const firm = await Firm.findById(req.params.id);
    if (!firm) {
      return res.status(404).json({ msg: 'Firm not found' });
    }

    // Delete associated image
    if (firm.shopLogo) {
      const imagePath = path.join(__dirname, '..', firm.shopLogo);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Firm.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Firm removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};