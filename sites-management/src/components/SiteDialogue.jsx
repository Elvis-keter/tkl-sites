import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";

const SiteDialogue = ({ open, onClose, site, onSaveSite }) => {
  const [formData, setFormData] = useState({
    id: "0", // Used internally, not sent to server
    site_id: "",
    property_id: 1,
    description: "",
    town_id: "",
    region_id: "",
    status_id: 1,
    network_id: 1,
    power_id: 1,
    longitude: "",
    latitude: "",
  });

  const [errors, setErrors] = useState({
    site_id: false,
    description: false,
    longitude: false,
    latitude: false,
  });

  // Initialize form data when a site is provided
  useEffect(() => {
    if (site) {
      setFormData({
        id: site.id || "0",
        site_id: site.site_id || "",
        property_id: site.property_id || 1,
        description: site.description || "",
        town_id: site.town_id || "",
        region_id: site.region_id || "",
        status_id: site.status_id || 1,
        network_id: site.network_id || 1,
        power_id: site.power_id || 1,
        longitude: site.longitude || "",
        latitude: site.latitude || "",
      });
      // Reset errors when loading existing site
      setErrors({
        site_id: false,
        description: false,
        longitude: false,
        latitude: false,
      });
    } else {
      // Reset form for new site
      setFormData({
        id: "0",
        site_id: "",
        property_id: 1,
        description: "",
        town_id: "",
        region_id: "",
        status_id: 1,
        network_id: 1,
        power_id: 1,
        longitude: "",
        latitude: "",
      });
    }
  }, [site]);

  const validateForm = () => {
    const newErrors = {
      site_id: !formData.site_id.trim(),
      description: !formData.description.trim(),
      longitude:
        !formData.longitude.toString().trim() ||
        isNaN(Number(formData.longitude)),
      latitude:
        !formData.latitude.toString().trim() ||
        isNaN(Number(formData.latitude)),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSave = () => {
    if (validateForm()) {
      // Extract id for operation type check but don't include in payload
      const { id, ...dataWithoutId } = formData;

      // Convert data types before saving
      const preparedData = {
        ...dataWithoutId,
        property_id: Number(dataWithoutId.property_id),
        status_id: Number(dataWithoutId.status_id),
        network_id: Number(dataWithoutId.network_id),
        power_id: Number(dataWithoutId.power_id),
        longitude: Number(dataWithoutId.longitude),
        latitude: Number(dataWithoutId.latitude),
      };

      // Include id separately for the calling code to determine if it's add or update
      onSaveSite({ ...preparedData, id: id });
    }
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: false });
    }
  };

  const dialogueGridStyle = { width: "450px", marginBottom: "14px" };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle className="text-telkom-blue">
        {formData.id === "0" ? "Add Site & Location" : "Update Site Data"}
      </DialogTitle>
      <DialogContent>
        <div
          style={{ padding: "5px 0px", maxHeight: "450px", overflowY: "auto" }}
        >
          <form>
            <Grid container spacing={2} sx={dialogueGridStyle}>
              <Grid item xs={6}>
                <TextField
                  label="Site ID"
                  fullWidth
                  size="small"
                  required
                  value={formData.site_id}
                  onChange={handleChange("site_id")}
                  error={errors.site_id}
                  helperText={errors.site_id ? "Site ID is required" : ""}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Description"
                  fullWidth
                  size="small"
                  required
                  value={formData.description}
                  onChange={handleChange("description")}
                  error={errors.description}
                  helperText={
                    errors.description ? "Description is required" : ""
                  }
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={dialogueGridStyle}>
              <Grid item xs={6}>
                <TextField
                  label="Town ID"
                  fullWidth
                  size="small"
                  value={formData.town_id}
                  onChange={handleChange("town_id")}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Region ID"
                  fullWidth
                  size="small"
                  value={formData.region_id}
                  onChange={handleChange("region_id")}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={dialogueGridStyle}>
              <Grid item xs={6}>
                <TextField
                  label="Longitude"
                  fullWidth
                  size="small"
                  required
                  value={formData.longitude}
                  onChange={handleChange("longitude")}
                  error={errors.longitude}
                  helperText={
                    errors.longitude ? "Valid longitude is required" : ""
                  }
                  type="number"
                  inputProps={{ step: "0.000001" }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Latitude"
                  fullWidth
                  size="small"
                  required
                  value={formData.latitude}
                  onChange={handleChange("latitude")}
                  error={errors.latitude}
                  helperText={
                    errors.latitude ? "Valid latitude is required" : ""
                  }
                  type="number"
                  inputProps={{ step: "0.000001" }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={dialogueGridStyle}>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    value={formData.status_id}
                    onChange={handleChange("status_id")}
                  >
                    <MenuItem value={1}>Active</MenuItem>
                    <MenuItem value={2}>Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Property Type</InputLabel>
                  <Select
                    label="Property Type"
                    value={formData.property_id}
                    onChange={handleChange("property_id")}
                  >
                    <MenuItem value={1}>Telephone Exchange</MenuItem>
                    <MenuItem value={2}>Office Building</MenuItem>
                    <MenuItem value={3}>Tower</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={dialogueGridStyle}>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Network Type</InputLabel>
                  <Select
                    label="Network Type"
                    value={formData.network_id}
                    onChange={handleChange("network_id")}
                  >
                    <MenuItem value={1}>Fiber</MenuItem>
                    <MenuItem value={2}>Copper</MenuItem>
                    <MenuItem value={3}>Wireless</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Power Type</InputLabel>
                  <Select
                    label="Power Type"
                    value={formData.power_id}
                    onChange={handleChange("power_id")}
                  >
                    <MenuItem value={1}>Main Grid</MenuItem>
                    <MenuItem value={2}>Generator</MenuItem>
                    <MenuItem value={3}>Solar</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </form>
        </div>
        <div
          style={{
            marginTop: "16px",
            padding: "15px 0px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button variant="contained" color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={handleSave}>
            {formData.id === "0" ? "Add" : "Update"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SiteDialogue;
