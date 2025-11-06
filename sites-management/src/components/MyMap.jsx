import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps";
import { Box, Button, IconButton, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SuperClusterAlgorithm from "../utils/superClusterAlgorithm";

const GOOGLE_MAPS_API_KEY = "";
const MAP_ID = "DEMO_MAP_ID";

// Kenya bounds
const KENYAN_BOUNDS = {
  north: 5.019,
  south: -4.679,
  east: 41.899,
  west: 33.909,
};

// Helper function for approval status text
const getApprovalStatusText = (status) => {
  switch (parseInt(status)) {
    case 0:
      return "Rejected Modification";
    case 1:
      return "Approved";
    case 2:
      return "Pending Approval";
    case 3:
      return "Pending Modification";
    case 4:
      return "Pending Addition";
    case 5:
      return "Pending Deletion";
    case 6:
      return "Rejected Addition";
    case 7:
      return "Rejected Deletion";
    case 8:
      return "Approved Deletion";
    default:
      return "Unknown Status";
  }
};

// Helper for map operations using useMap hook
const MapOperations = ({ zoomCoordinates, selectedSite, markerMapRef }) => {
  const map = useMap();

  // Handle zooming to coordinates
  useEffect(() => {
    if (map && zoomCoordinates && zoomCoordinates.lat && zoomCoordinates.lng) {
      console.log("Zooming to coordinates:", zoomCoordinates);
      map.panTo(zoomCoordinates);
      map.setZoom(16);
    }
  }, [map, zoomCoordinates]);

  // Handle zoom to selected site
  useEffect(() => {
    if (!map || !selectedSite || !selectedSite.siteId) return;

    // Find marker data for selected site
    const markerData = markerMapRef.current.get(selectedSite.siteId);
    if (markerData) {
      // Don't zoom if we're already handling external coordinates
      if (!zoomCoordinates) {
        console.log("Zooming to selected site:", selectedSite.siteId);
        map.panTo(markerData);
        map.setZoom(16);
      }
    }
  }, [map, selectedSite, markerMapRef, zoomCoordinates]);

  return null; // This component doesn't render anything
};

// Marker Clusterer component
const MarkerClusterer = ({
  children,
  sites,
  setContextMenuSite,
  setContextMenuPosition,
}) => {
  const map = useMap();
  const [clusters, setClusters] = useState([]);
  const [zoom, setZoom] = useState(3);
  const [bounds, setBounds] = useState(null);
  const algorithm = useRef(new SuperClusterAlgorithm({ radius: 200 }));

  // Store listener cleanup functions
  const listenersRef = useRef([]);

  // Update clusters when map changes
  useEffect(() => {
    if (!map || !sites || !sites.length) return;

    const handleZoomChanged = () => {
      setZoom(map.getZoom());
    };

    const handleBoundsChanged = () => {
      const bounds = map.getBounds();
      if (bounds) {
        setBounds({
          ne: {
            lat: bounds.getNorthEast().lat(),
            lng: bounds.getNorthEast().lng(),
          },
          sw: {
            lat: bounds.getSouthWest().lat(),
            lng: bounds.getSouthWest().lng(),
          },
        });
      }
    };

    // Add event listeners using the correct method for vis.gl library
    const zoomListener = map.addListener("zoom_changed", handleZoomChanged);
    const boundsListener = map.addListener(
      "bounds_changed",
      handleBoundsChanged,
    );

    // Store cleanup functions
    listenersRef.current = [zoomListener, boundsListener];

    // Initial bounds
    handleZoomChanged();
    handleBoundsChanged();

    return () => {
      // Cleanup listeners correctly
      listenersRef.current.forEach((listener) => {
        if (listener) {
          // In vis.gl, the addListener returns an object with a remove method
          listener.remove();
        }
      });
    };
  }, [map, sites]);

  // Generate clusters
  useEffect(() => {
    if (!map || !bounds || !sites.length) return;

    // Convert sites to GeoJSON points for supercluster
    const points = sites
      .filter((site) => site && site.latitude && site.longitude)
      .map((site) => ({
        type: "Feature",
        properties: {
          siteId: site.siteId || site.id,
          site: site,
        },
        geometry: {
          type: "Point",
          coordinates: [parseFloat(site.longitude), parseFloat(site.latitude)],
        },
      }));

    // Update the clusterer with new points
    algorithm.current.calculate({
      points,
      bounds,
      zoom,
    });

    // Get clusters for current state
    const newClusters = algorithm.current.getClusters();
    setClusters(newClusters);
  }, [sites, zoom, bounds, map]);

  return (
    <>
      {clusters.map((cluster) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const { cluster: isCluster, point_count: pointCount } =
          cluster.properties;

        if (isCluster) {
          // Render a cluster marker
          return (
            <AdvancedMarker
              key={`cluster-${cluster.id}`}
              position={{ lat: latitude, lng: longitude }}
              onClick={() => {
                // Zoom in when clicking a cluster
                const expansionZoom =
                  algorithm.current.getClusterExpansionZoom(cluster);
                map.setZoom(expansionZoom);
                map.panTo({ lat: latitude, lng: longitude });
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: `${30 + (pointCount / sites.length) * 20}px`,
                  height: `${30 + (pointCount / sites.length) * 20}px`,
                  minWidth: "40px",
                  minHeight: "40px",
                  backgroundColor: "#00AACA",
                  borderRadius: "50%",
                  color: "white",
                  border: "3px solid white",
                  fontSize: "16px",
                  fontWeight: "bold",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
                }}
              >
                {pointCount}
              </div>
            </AdvancedMarker>
          );
        }

        // Individual site marker
        return (
          <SiteMarker
            key={`site-${cluster.properties.site.id || cluster.properties.site.siteId}`}
            site={cluster.properties.site}
            setContextMenuSite={setContextMenuSite}
            setContextMenuPosition={setContextMenuPosition}
          />
        );
      })}

      {/* Children (other non-clustered markers like the animated marker) */}
      {children}
    </>
  );
};

// Custom marker with InfoWindow
const SiteMarker = React.memo(
  ({ site, setContextMenuSite, setContextMenuPosition }) => {
    const [markerRef, marker] = useAdvancedMarkerRef();
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    if (!site || !site.latitude || !site.longitude) return null;

    const position = {
      lat: parseFloat(site.latitude),
      lng: parseFloat(site.longitude),
    };

    const handleMarkerClick = () => {
      setContextMenuSite(site);
      setIsInfoOpen(true);
    };

    const handleOpenContextMenu = () => {
      setContextMenuPosition(position);
      setContextMenuSite(site);
      setIsInfoOpen(false);
    };

    return (
      <>
        <AdvancedMarker
          position={position}
          ref={markerRef}
          title={site.siteName || site.siteId}
          onClick={handleMarkerClick}
        />

        {isInfoOpen && (
          <InfoWindow
            anchor={marker}
            onCloseClick={() => setIsInfoOpen(false)}
            headerDisabled={true}
          >
            <div className="info-window">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <h4>Site ID : {site.id || ""}</h4>
                  <h4>Site Name : {site.site_id || ""}</h4>
                  <h4>Site Power : {site.power_id || ""}</h4>
                  <h4>Property ID : {site.property_id || ""}</h4>
                  <h4>Town : {site.town_id || ""}</h4>
                  <h4>Region : {site.region_id || ""}</h4>
                  <h4>Long : {site.longitude || ""}</h4>
                  <h4>Lat : {site.latitude || ""}</h4>
                </div>

                <div className="flex flex-col ml-6">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsInfoOpen(false);
                    }}
                    style={{
                      backgroundColor: "white",
                      color: "#ff2c2c",
                      border: "1px solid ",
                      margin: "auto auto 4px auto",
                      padding: "4px",
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={handleOpenContextMenu}
                    style={{
                      margin: "auto",
                      padding: "4px",
                      backgroundColor: "#00AACA",
                      color: "white",
                    }}
                    title="More options"
                  >
                    <MoreVertIcon />
                  </IconButton>
                </div>
              </div>
            </div>
          </InfoWindow>
        )}
      </>
    );
  },
);

// Animated marker for selected site
const AnimatedMarker = ({ position }) => {
  if (!position) return null;

  return (
    <AdvancedMarker position={position}>
      <div className="bouncing-pin">
        <Pin
          background="#74B72E"
          borderColor="#FFFFFF"
          scale={1.2}
          glyphColor="#FFFFFF"
        />
        <style>{`
          .bouncing-pin {
            animation: bounce 1.4s infinite;
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
      </div>
    </AdvancedMarker>
  );
};

// Context Menu using InfoWindow
const ContextMenu = ({
  position,
  site,
  onClose,
  onEdit,
  onDelete,
  onAddPassiveElement,
  onShowInventoryReport,
  onShowAssetHistory,
  onShowNeLicenses,
}) => {
  const [dummyMarkerRef, dummyMarker] = useAdvancedMarkerRef();

  if (!position) return null;

  const buttonStyle = {
    width: "100%",
    padding: "8px",
    margin: "4px 0",
    backgroundColor: "#f0f0f0",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "14px",
  };

  const closeButtonStyle = {
    width: "100%",
    padding: "8px",
    margin: "8px 0 0 0",
    backgroundColor: "#e0e0e0",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "14px",
  };

  return (
    <>
      <AdvancedMarker
        position={position}
        ref={dummyMarkerRef}
        visible={false} // Hide the marker but use it as an anchor
      />
      <InfoWindow anchor={dummyMarker} onCloseClick={onClose}>
        <div
          style={{
            minWidth: "100px",
            padding: "0px",
          }}
        >
          <button onClick={onEdit} style={buttonStyle}>
            Edit Site
          </button>
          <button onClick={onDelete} style={buttonStyle}>
            Delete Site
          </button>
          <button onClick={onClose} style={closeButtonStyle}>
            Close
          </button>
        </div>
      </InfoWindow>
    </>
  );
};

// Add Site Button with InfoWindow
const AddSiteButton = ({ position, onAdd, onCancel }) => {
  const [dummyMarkerRef, dummyMarker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker position={position} ref={dummyMarkerRef} />
      <InfoWindow
        anchor={dummyMarker}
        onCloseClick={onCancel}
        headerDisabled={true}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "2px",
          }}
        >
          <Button
            variant="contained"
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            style={{
              backgroundColor: "#00AACA",
            }}
          >
            Add Site
          </Button>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            style={{
              backgroundColor: "white",
              border: "1px solid #ccc",
              padding: "4px",
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      </InfoWindow>
    </>
  );
};

const MyMap = React.memo(
  ({
    sites,
    mapOptions,
    dataFetched,
    zoomCoordinates,
    contextMenuPosition,
    contextMenuSite,
    setContextMenuPosition,
    setContextMenuSite,
    handleEditSite,
    handleDeleteSite,
    handleAddPassiveElement,
    handleShowInventoryReport,
    handleShowAssetHistory,
    handleShowNeLicenses,
    handleShowReport,
    loading,
    selectedSite,
    onAddSite,
  }) => {
    const mapRef = useRef(null);
    const [buttonVisible, setButtonVisible] = useState(false);
    const [buttonPosition, setButtonPosition] = useState(null);

    // Use JavaScript's built-in Map constructor
    const markerMapRef = useRef(new window.Map());

    // Animation marker state
    const [animationPosition, setAnimationPosition] = useState(null);

    // Update marker mapping when sites change
    useEffect(() => {
      // Clear previous mapping
      markerMapRef.current.clear();

      // Create new mapping
      if (sites && sites.length) {
        sites.forEach((site) => {
          if (site && site.siteId && site.latitude && site.longitude) {
            const lat = parseFloat(site.latitude);
            const lng = parseFloat(site.longitude);
            markerMapRef.current.set(site.siteId, { lat, lng });
          }
        });
      }
    }, [sites]);

    // Close button visibility when context menu is shown
    useEffect(() => {
      if (contextMenuPosition) {
        setButtonVisible(false);
      }
    }, [contextMenuPosition]);

    // Enhanced map options
    const stableMapOptions = useMemo(() => {
      return {
        ...mapOptions,
        mapId: MAP_ID, // Required for advanced markers
      };
    }, [mapOptions]);

    // Handle selectedSite changes - create or update animation marker
    useEffect(() => {
      // No selected site, hide animation marker
      if (!selectedSite || !selectedSite.siteId) {
        setAnimationPosition(null);
        return;
      }

      // Find marker data for selected site
      const markerData = markerMapRef.current.get(selectedSite.siteId);
      if (!markerData) {
        setAnimationPosition(null);
        return;
      }

      // Update animation position
      console.log("Setting animation for site:", selectedSite.siteId);
      setAnimationPosition(markerData);

      // Stop animation after 3 seconds
      const timeout = setTimeout(() => {
        setAnimationPosition(null);
      }, 3000);

      return () => clearTimeout(timeout);
    }, [selectedSite]);

    const handleMapClick = (e) => {
      // Close any open context menu
      setContextMenuPosition(null);
      setContextMenuSite(null);

      // Get click coordinates
      const lat = e.detail.latLng.lat;
      const lng = e.detail.latLng.lng;

      // Only show add site button within Kenya bounds
      if (
        lat >= KENYAN_BOUNDS.south &&
        lat <= KENYAN_BOUNDS.north &&
        lng >= KENYAN_BOUNDS.west &&
        lng <= KENYAN_BOUNDS.east
      ) {
        setButtonPosition({ lat, lng });
        setButtonVisible(true);
      } else {
        alert("You can only add sites within Kenyan bounds.");
      }
    };

    const handleAddSite = () => {
      if (!buttonPosition) return;

      const { lat, lng } = buttonPosition;

      // Create a new site object with the clicked coordinates
      const newSite = {
        id: "0", // to indicate new site
        siteId: "",
        siteName: "",
        longitude: lng.toString(),
        latitude: lat.toString(),
        siteAddress: "",
        ON_AIR_DATE: "",
        Zone: "",
        isHubSite: "",
        parentHubSiteId: "",
        managedBy: "",
        sitePriority: "",
        siteCategoryName: "",
        approvalStatus: "4", // Default to "Pending Addition"
      };

      // Pass the new site to the parent component
      if (onAddSite) {
        onAddSite(newSite, { lat, lng });
      }

      // Close the add site interface and clean up
      setButtonVisible(false);
      setButtonPosition(null);
    };

    const handleCancel = () => {
      // Properly clean up when cancelling
      setButtonPosition(null);
      setButtonVisible(false);
    };

    if (loading) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    return (
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        {loading && (
          <div
            style={{
              position: "fixed",
              top: 50,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 2000,
            }}
          >
            <h3 style={{ animation: "blinkingText 2s infinite" }}>
              Fetching Data...
            </h3>
          </div>
        )}

        <Map
          mapId={MAP_ID}
          defaultCenter={mapOptions.center}
          defaultZoom={mapOptions.zoom}
          gestureHandling="greedy"
          disableDefaultUI={false}
          mapTypeControl={true}
          mapTypeId={mapOptions.mapTypeId}
          onClick={handleMapClick}
          onLoad={(map) => {
            mapRef.current = map;
          }}
        >
          {/* Map Operations Handler - Fixes zoomToMarker functionality */}
          <MapOperations
            zoomCoordinates={zoomCoordinates}
            selectedSite={selectedSite}
            markerMapRef={markerMapRef}
          />

          {/* Marker Clusterer with Site Markers */}
          <MarkerClusterer
            sites={sites}
            setContextMenuSite={setContextMenuSite}
            setContextMenuPosition={setContextMenuPosition}
          >
            {/* Animated Marker for Selected Site - not clustered */}
            {animationPosition && (
              <AnimatedMarker position={animationPosition} />
            )}
          </MarkerClusterer>

          {/* Context Menu as InfoWindow */}
          {contextMenuPosition && contextMenuSite && (
            <ContextMenu
              position={contextMenuPosition}
              site={contextMenuSite}
              onClose={() => {
                setContextMenuPosition(null);
                setContextMenuSite(null);
              }}
              onEdit={() => {
                setContextMenuPosition(null);
                setContextMenuSite(null);
                handleEditSite(contextMenuSite);
              }}
              onDelete={() => {
                setContextMenuPosition(null);
                setContextMenuSite(null);
                handleDeleteSite(contextMenuSite);
              }}
              onAddPassiveElement={() => {
                setContextMenuPosition(null);
                setContextMenuSite(null);
                handleAddPassiveElement(contextMenuSite);
              }}
              onShowInventoryReport={() => {
                setContextMenuPosition(null);
                setContextMenuSite(null);
                handleShowInventoryReport(contextMenuSite);
              }}
              onShowAssetHistory={() => {
                setContextMenuPosition(null);
                setContextMenuSite(null);
                handleShowAssetHistory(contextMenuSite);
              }}
              onShowNeLicenses={() => {
                setContextMenuPosition(null);
                setContextMenuSite(null);
                handleShowNeLicenses(contextMenuSite);
              }}
            />
          )}

          {/* Add Site Button as InfoWindow */}
          {buttonVisible && buttonPosition && (
            <AddSiteButton
              position={buttonPosition}
              onAdd={handleAddSite}
              onCancel={handleCancel}
            />
          )}
        </Map>
      </APIProvider>
    );
  },
);

export { MyMap, getApprovalStatusText };
