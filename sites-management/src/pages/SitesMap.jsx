import React, { useState, useEffect, useRef } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Copyright } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import axios from "axios";
import Constants from "../utils/Constants";
import { DataGrid } from "@mui/x-data-grid";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import SearchComponent from "../components/SearchComponent";
import { MyMap, getApprovalStatusText } from "../components/MyMap";
import AddSiteModal from "../components/AddSiteModal"; // Import the new component

// Marker position on first map load
let mapMarker = {
  center: { lat: 0.85, lng: 37.817223 }, // Kenya's center coordinates
  zoom: 7,
};

function SitesMap() {
  // Current user and time information
  const currentUser = "ysxninjaupdate";
  const currentDateTime = "2025-05-14 09:37:14";

  // State for map and sites
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dataFetched, setDataFetched] = useState(false);
  const [panelViewData, setPanelViewData] = useState([]);
  const [zoomCoordinates, setZoomCoordinates] = useState(null);
  const [mapOptions, setMapOptions] = useState(mapMarker);
  const [showPanel, setShowPanel] = React.useState(false);
  const [loading, setLoading] = useState(true);

  // State for the new site modal
  const [openSiteModal, setOpenSiteModal] = useState(false);
  const [currentSite, setCurrentSite] = useState(null);

  // State for delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState(null);

  // State for alerts and success messages
  const [alertSeverity, setAlertSeverity] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [openSuccessDialogue, setOpenSuccessDialogue] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);

  // State for context menu
  const [contextMenuPosition, setContextMenuPosition] = useState(null);
  const [contextMenuSite, setContextMenuSite] = useState(null);

  // Fetch Sites on component mount
  useEffect(() => {
    fetchAllSites();
    setLoading(false);
  }, []);

  // Filter locations based on search term
  useEffect(() => {
    if (locations.length > 0) {
      if (!searchTerm) {
        setFilteredLocations(locations);
      } else {
        const filtered = locations.filter(
          (site) =>
            site.site_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            site.property_id?.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        setFilteredLocations(filtered);
      }
    }
  }, [searchTerm, locations]);

  // Function to add a new site
  const postSites = (siteData) => {
    async function fetchData() {
      try {
        console.log("Posting Site:", siteData);

        // Send data to the API
        const response = await axios.post(Constants.postSitesUrl, siteData);

        if (response.status === 200 || response.status === 201) {
          console.log("Response data --> ", response.data);
          setAlertSeverity("success");
          setAlertMessage(
            <span>
              The site{" "}
              <strong style={{ color: "green" }}>{siteData.site_id}</strong> has
              been successfully added.
            </span>,
          );
          setOpenSuccessDialogue(true);
          fetchAllSites(); // Refresh sites data
        } else {
          setAlertSeverity("error");
          setAlertMessage(
            "Unexpected response received. Please check the data.",
          );
          setOpenSuccessDialogue(true);
        }
      } catch (error) {
        console.error("Error adding site:", error);
        setAlertSeverity("error");
        setAlertMessage(error.response?.data?.message || "Error adding site");
        setOpenSuccessDialogue(true);
      }
    }
    fetchData();
  };

  // Function to update a site
  const updateSite = (siteData) => {
    async function fetchData() {
      try {
        const siteId = String(siteData.site_id);
        console.log("Updating site:", siteId);

        // Set approval status to pending modification
        siteData.approvalStatus = 3;

        const url = `${Constants.getAllSitesUrl}/${siteId}`;
        console.log("URL:", url);

        const response = await axios.post(url, siteData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          console.log("Response data --> ", response.data);
          setAlertSeverity("success");
          setAlertMessage(
            <Typography variant="body1" component="span">
              Site ID:{" "}
              <Typography
                variant="body1"
                component="span"
                sx={{ color: "success.main", fontWeight: "bold" }}
              >
                {siteId}
              </Typography>{" "}
              flagged for modification successfully.
            </Typography>,
          );
          setOpenSuccessDialogue(true);
          fetchAllSites(); // Refresh sites data
        }
      } catch (error) {
        console.error("Error updating site:", error);
        setAlertSeverity("error");
        setAlertMessage(
          error.response?.data?.message || "Failed to update site",
        );
        setOpenSuccessDialogue(true);
      }
    }
    fetchData();
  };

  // Success Dialog Component
  const SuccessDialogue = ({
    openDialog,
    onCloseDialog,
    alertSeverity,
    alertMessage,
  }) => {
    return (
      <Dialog open={openDialog} onClose={() => onCloseDialog(false)}>
        <DialogTitle color={alertSeverity === "success" ? "primary" : "error"}>
          {alertSeverity === "success" ? "Success" : "Error"}
        </DialogTitle>
        <DialogContent>
          <div style={{ padding: "20px 10px" }}>{alertMessage}</div>
          <div
            style={{
              padding: "10px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => onCloseDialog(false)}
            >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Function to close success dialog
  const closeSuccessDialogue = (value) => {
    setOpenSuccessDialogue(value);
  };

  // Function to handle Add site
  const handleAddNewSite = (newSite, coordinates) => {
    setZoomCoordinates(coordinates);
    setCurrentSite({
      id: "1", // Indicate this is a new site
      latitude: coordinates.lat,
      longitude: coordinates.lng,
    });
    setOpenSiteModal(true);
  };

  // Function to handle Edit option from context menu
  const handleEditSite = (site) => {
    console.log("Editing site:", site);
    setCurrentSite(site);
    setOpenSiteModal(true);
    setSelectedSite(site);
  };

  // Function to handle Delete option from context menu
  const handleDeleteSite = (site) => {
    console.log("Deleting site:", site);
    setSiteToDelete(site);
    setShowDeleteConfirm(true);
    setSelectedSite(site);
  };

  // Function to handle Show Report option from context menu
  const handleShowReport = (site) => {
    console.log("Showing report for site:", site);
    setPanelViewData(site.sitesInventory || []);
    setShowPanel(true);
    setSelectedSite(site);
  };

  // Function to handle site selection from search results
  const handleSelectSite = (site) => {
    const lat = parseFloat(site.latitude);
    const lng = parseFloat(site.longitude);
    setZoomCoordinates({ lat, lng });
    setSelectedSite(site);
  };

  // Function to confirm site deletion
  const confirmDeleteSite = async () => {
    if (!siteToDelete) return;

    try {
      const siteId = siteToDelete.siteId || siteToDelete.id;
      const url = `${Constants.getAllSitesUrl}/${siteId}`;

      // Send DELETE request
      const response = await axios.post(url, null);

      if (response.status === 200) {
        setAlertSeverity("success");
        setAlertMessage("The site has been successfully flagged for deletion");
        setShowDeleteConfirm(false);
        setSiteToDelete(null);
        setOpenSuccessDialogue(true);
        fetchAllSites(); // Refresh the sites list
      }
    } catch (error) {
      console.error("Error marking site for deletion:", error);
      setAlertSeverity("error");
      setAlertMessage("Failed to mark site for deletion. Please try again.");
      setShowDeleteConfirm(false);
      setSiteToDelete(null);
      setOpenSuccessDialogue(true);
    }
  };

  // Function to fetch all sites
  function fetchAllSites() {
    async function fetchData() {
      try {
        const response = await axios.get(Constants.getAllSitesUrl);
        if (response.status === 200) {
          const data = response.data;
          if (data && Array.isArray(data)) {
            console.log("Sites data : ", data.length);
            setLocations(data);
            setFilteredLocations(data);
            setDataFetched(true);
          } else {
            console.error("Received data is not an array:", data);
          }
        } else {
          console.error("Failed to fetch sites data");
        }
      } catch (error) {
        console.error("Error fetching sites data:", error);
      }
    }
    fetchData();
  }

  // Handle saving site data
  const handleSaveSite = (formData) => {
    // Check if it's a new site or an existing site being edited
    if (currentSite && currentSite.id && currentSite.id !== "1") {
      // Update existing site
      updateSite(formData);
    } else {
      // Add new site
      postSites(formData);
    }
    setOpenSiteModal(false);
  };

  const PanelView = React.memo(({ siteData }) => {
    const columns = [
      {
        width: 100,
        field: "Site Id",
        renderHeader: () => <strong>{"Site ID"}</strong>,
      },
      {
        width: 100,
        field: "Site Name",
        renderHeader: () => <strong>{"Site Name"}</strong>,
      },
    ];
    return (
      <div
        style={{
          position: "absolute",
          top: 160,
          right: 50,
          zIndex: 1000,
          backgroundColor: "white",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
          width: "480px",
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box
              sx={{
                height: 300,
                width: "100%",
                "& .hot": {
                  backgroundColor: "#ff943975",
                  color: "#1a3e72",
                },
              }}
            >
              <DataGrid
                rows={panelViewData}
                columns={columns}
                getRowId={(row) => row.siteId}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 100,
                    },
                  },
                }}
                pageSizeOptions={[100]}
                disableRowSelectionOnClick
                checkboxSelection={false}
                localeText={{ noRowsLabel: "Just a placeholder" }}
                rowHeight={32}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={() => setShowPanel(false)}
              style={{ padding: "9px 15px", fontSize: "14px" }}
            >
              Close
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  });

  // Site search results component
  const SearchResults = ({ results, onSelect }) => {
    if (results.length > 700) return null;

    return (
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 20,
          zIndex: 1000,
          backgroundColor: "white",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
          width: "320px",
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Site Results ({results.length})
        </Typography>
        <Box sx={{ mb: 2 }}>
          {results.map((site) => (
            <Box
              key={site.id}
              sx={{
                p: 1,
                border: "1px solid #eee",
                borderRadius: "4px",
                mb: 1,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
                backgroundColor:
                  selectedSite && selectedSite.id === site.id
                    ? "#e3f2fd"
                    : "transparent",
              }}
              onClick={() => onSelect(site)}
            >
              <Typography variant="subtitle1">{site.site_id}</Typography>
              <Typography variant="body2">{site.description}</Typography>
              <Typography variant="caption">
                Status: {getApprovalStatusText(site.status_id)}
              </Typography>
            </Box>
          ))}
        </Box>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setSearchTerm("")}
          fullWidth
        >
          Clear Results
        </Button>
      </div>
    );
  };

  return (
    <div className="mt-2">
      {/* Display Map with Filtered Locations */}
      <div className="max-w-7xl mx-auto p-2">
        <Paper
          sx={{
            p: 1,
            display: "flex",
            flexDirection: "column",
            height: "calc(90vh - 40px)",
            width: "100%",
          }}
        >
          {showPanel && <PanelView panelViewData={panelViewData} />}

          <div
            style={{
              position: "relative",
              top: 0,
              left: 0,
            }}
          >
            {/* Site Search Input */}
            <SearchComponent
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
            {/* Search Results */}
            {searchTerm && (
              <SearchResults
                results={filteredLocations}
                onSelect={handleSelectSite}
              />
            )}
          </div>
          <MyMap
            sites={filteredLocations}
            mapOptions={mapOptions}
            dataFetched={dataFetched}
            zoomCoordinates={zoomCoordinates}
            contextMenuPosition={contextMenuPosition}
            contextMenuSite={contextMenuSite}
            setContextMenuPosition={setContextMenuPosition}
            setContextMenuSite={setContextMenuSite}
            handleEditSite={handleEditSite}
            handleDeleteSite={handleDeleteSite}
            handleShowReport={handleShowReport}
            loading={loading}
            selectedSite={selectedSite}
            onAddSite={handleAddNewSite}
          />
        </Paper>
      </div>

      {/* New Site Modal */}
      {openSiteModal && (
        <AddSiteModal
          open={openSiteModal}
          onClose={() => setOpenSiteModal(false)}
          site={currentSite}
          onSaveSite={handleSaveSite}
        />
      )}

      {/* Confirmation Dialog for Delete */}
      <Dialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <div style={{ padding: "20px 10px" }}>
            Are you sure you want to delete site{" "}
            {siteToDelete?.siteId || siteToDelete?.site_id}?
          </div>
          <div
            style={{
              padding: "10px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={confirmDeleteSite}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialogue */}
      {openSuccessDialogue && (
        <SuccessDialogue
          openDialog={openSuccessDialogue}
          onCloseDialog={closeSuccessDialogue}
          alertSeverity={alertSeverity}
          alertMessage={alertMessage}
        />
      )}

      {/* User info display at the bottom */}
      <Box
        sx={{
          p: 1,
          mt: 1,
          fontSize: "0.8rem",
          color: "text.secondary",
          textAlign: "center",
        }}
      >
        Last updated: {currentDateTime} | User: {currentUser}
      </Box>
    </div>
  );
}

export default SitesMap;
