import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import axios from "axios";
import Constants from "../utils/Constants";

const AddSiteModal = ({ open, onClose, site, onSaveSite }) => {
  const [formData, setFormData] = useState({
    site_id: "",
    property_id: "",
    description: "",
    town_id: "",
    region_id: "",
    network_id: "",
    power_id: "",
    latitude: "",
    longitude: "",
    // Status fields
    enroachment_status: "",
    critical_to_enterprise: "",
    status_description: "",
    govt_equp: "",
    strategic_to_tkl: "",
    tkl_shop: "",
    atc_tower: "",
    charged_to_bank: "",
    on_sfc_deed: "",
    requested_by_sfc: "",
    on_atc_court: "",
    on_atc_deed: "",
    wholesale: "",
    ownership_docs: "",
  });

  // State for dropdown options
  const [loading, setLoading] = useState(true);
  const [propertiesOptions, setPropertiesOptions] = useState([]);
  const [townsOptions, setTownsOptions] = useState([]);
  const [regionsOptions, setRegionsOptions] = useState([]);
  const [networkOptions, setNetworkOptions] = useState([]);
  const [powerOptions, setPowerOptions] = useState([]);
  const [error, setError] = useState(null);

  // Initialize form data when site prop changes
  useEffect(() => {
    if (site) {
      // If editing existing site
      if (site.id && site.id !== "1") {
        setFormData({
          site_id: site.site_id || "",
          property_id: site.property_id || "",
          description: site.description || "",
          town_id: site.town_id || "",
          region_id: site.region_id || "",
          network_id: site.network_id || "",
          power_id: site.power_id || "",
          latitude: site.latitude || "",
          longitude: site.longitude || "",
          // Status fields will be empty when editing
          enroachment_status: "",
          critical_to_enterprise: "",
          status_description: "",
          govt_equp: "",
          strategic_to_tkl: "",
          tkl_shop: "",
          atc_tower: "",
          charged_to_bank: "",
          on_sfc_deed: "",
          requested_by_sfc: "",
          on_atc_court: "",
          on_atc_deed: "",
          wholesale: "",
          ownership_docs: "",
        });
      }
      // If adding new site with coordinates
      else if (site.latitude && site.longitude) {
        setFormData((prev) => ({
          ...prev,
          latitude: site.latitude || "",
          longitude: site.longitude || "",
        }));
      }
    }
    fetchDropdownData();
  }, [site]);

  // Fetch dropdown options
  const fetchDropdownData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [propertiesRes, regionsRes, townsRes, networkRes, powerRes] =
        await Promise.all([
          axios.get(`${Constants.getSitePath}properties`),
          axios.get(`${Constants.getSitePath}regions`),
          axios.get(`${Constants.getSitePath}towns`),
          axios.get(`${Constants.getSitePath}networks`),
          axios.get(`${Constants.getSitePath}power`),
        ]);

      setPropertiesOptions(propertiesRes.data || []);
      setRegionsOptions(regionsRes.data || []);
      setTownsOptions(townsRes.data || []);
      setNetworkOptions(networkRes.data || []);
      setPowerOptions(powerRes.data || []);
    } catch (err) {
      console.error("Error fetching dropdown data:", err);
      setError("Failed to load form data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // If changing region, reset town
    if (name === "region_id") {
      setFormData((prev) => ({
        ...prev,
        town_id: "",
      }));
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked ? "Y" : "",
    });
  };

  // Filter towns by selected region
  const getFilteredTowns = () => {
    if (!formData.region_id) return townsOptions;
    const townRegionName = regionsOptions[formData.region_id - 1]?.region_name;
    return townsOptions.filter((town) => town.region_id == townRegionName);
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate required fields
    const requiredFields = [
      "site_id",
      "description",
      "town_id",
      "region_id",
      "network_id",
      "power_id",
      "latitude",
      "longitude",
      "property_id",
    ];

    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      setError(`Please fill all required fields: ${missingFields.join(", ")}`);
      return;
    }

    // Format data for submission
    // If editing site, we use the update format
    if (site && site.id && site.id !== "1") {
      // For updates, we only send the basic site fields
      const updateData = {
        site_id: formData.site_id,
        property_id: formData.property_id,
        description: formData.description,
        town_id: formData.town_id,
        region_id: formData.region_id,
        network_id: formData.network_id,
        power_id: formData.power_id,
        latitude: formData.latitude,
        longitude: formData.longitude,
      };
      onSaveSite(updateData);
    } else {
      // For new sites, we send all the data including status fields
      onSaveSite(formData);
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {site && site.id && site.id !== "1" ? "Edit Site" : "Add New Site"}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="h6" sx={{ mb: 2 }}>
          Site Information
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Basic Site Information */}

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Site ID"
                name="site_id"
                value={formData.site_id}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Region</InputLabel>
                <Select
                  name="region_id"
                  value={formData.region_id}
                  onChange={handleInputChange}
                  label="Region"
                  className="min-w-28"
                >
                  {regionsOptions.map((region) => (
                    <MenuItem key={region.id} value={region.id}>
                      {region.region_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required disabled={!formData.region_id}>
                <InputLabel>Town</InputLabel>
                <Select
                  name="town_id"
                  value={formData.town_id}
                  onChange={handleInputChange}
                  label="Town"
                  className="min-w-28"
                >
                  {getFilteredTowns().map((town) => (
                    <MenuItem key={town.id} value={town.id}>
                      {town.town_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Property</InputLabel>
                <Select
                  name="property_id"
                  value={formData.property_id}
                  onChange={handleInputChange}
                  label="Property"
                  className="min-w-28"
                >
                  {propertiesOptions.map((property) => (
                    <MenuItem key={property.id} value={property.id}>
                      {property.title} - {property.asset_description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Network</InputLabel>
                <Select
                  name="network_id"
                  value={formData.network_id}
                  onChange={handleInputChange}
                  label="Network"
                  className="min-w-28"
                >
                  {networkOptions.map((network) => (
                    <MenuItem key={network.id} value={network.id}>
                      {network.network_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Power</InputLabel>
                <Select
                  name="power_id"
                  value={formData.power_id}
                  onChange={handleInputChange}
                  label="Power"
                  className="min-w-28"
                >
                  {powerOptions.map((power) => (
                    <MenuItem key={power.id} value={power.id}>
                      {power.main_power} ({power.backup_power})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                type="number"
                inputProps={{ step: "any" }}
                className="min-w-28"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                type="number"
                inputProps={{ step: "any" }}
                className="min-w-28"
              />
            </Grid>
          </Grid>

          {/* Status Information - Only show for new sites */}
          {(!site || (site && site.id === "1")) && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 0, mt: 2 }}>
                  Status Information
                </Typography>
              </Grid>
              <div className="gap-4 mb-6 space-y-2">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Status Description"
                    name="status_description"
                    value={formData.status_description}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Encroachment Status"
                    name="enroachment_status"
                    value={formData.enroachment_status}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Ownership Documents"
                    name="ownership_docs"
                    value={formData.ownership_docs}
                    onChange={handleInputChange}
                    placeholder="T, N, or other code"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mt: 1, mb: 2 }}>
                    Status Flags
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={4}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.tkl_shop === "Y"}
                            onChange={handleCheckboxChange}
                            name="tkl_shop"
                          />
                        }
                        label="TKL Shop"
                      />
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.critical_to_enterprise === "Y"}
                            onChange={handleCheckboxChange}
                            name="critical_to_enterprise"
                          />
                        }
                        label="Critical to Enterprise"
                      />
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.atc_tower === "Y"}
                            onChange={handleCheckboxChange}
                            name="atc_tower"
                          />
                        }
                        label="ATC Tower"
                      />
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.charged_to_bank === "Y"}
                            onChange={handleCheckboxChange}
                            name="charged_to_bank"
                          />
                        }
                        label="Charged to Bank"
                      />
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.on_sfc_deed === "Y"}
                            onChange={handleCheckboxChange}
                            name="on_sfc_deed"
                          />
                        }
                        label="On SFC Deed"
                      />
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.requested_by_sfc === "Y"}
                            onChange={handleCheckboxChange}
                            name="requested_by_sfc"
                          />
                        }
                        label="Requested by SFC"
                      />
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.on_atc_court === "Y"}
                            onChange={handleCheckboxChange}
                            name="on_atc_court"
                          />
                        }
                        label="On ATC Court"
                      />
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.on_atc_deed === "Y"}
                            onChange={handleCheckboxChange}
                            name="on_atc_deed"
                          />
                        }
                        label="On ATC Deed"
                      />
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.wholesale === "Y"}
                            onChange={handleCheckboxChange}
                            name="wholesale"
                          />
                        }
                        label="Wholesale"
                      />
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.govt_equp === "Y"}
                            onChange={handleCheckboxChange}
                            name="govt_equp"
                          />
                        }
                        label="Govt Equipment"
                      />
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.strategic_to_tkl === "Y"}
                            onChange={handleCheckboxChange}
                            name="strategic_to_tkl"
                          />
                        }
                        label="Strategic to TKL"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} style={{ color: "#00AACA" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          style={{ backgroundColor: "#00AACA" }}
        >
          {site && site.id && site.id !== "1" ? "Update Site" : "Add Site"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSiteModal;
