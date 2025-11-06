import React from "react";
import { OverlayView } from "@react-google-maps/api";
// import "../routes/GoogleMapsPage.css";

const ContextMenuControl = ({
  position,
  site,
  onClose,
  onEdit,
  onDelete,
  onAddPassiveElement,
  onShowInventoryReport,
  onShowAssetHistory,
  onShowNeLicenses,
  onShowReport,
}) => {
  if (!position) return null;

  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div
        className="marker-context-menu"
        style={{
          backgroundColor: "white",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          borderRadius: "4px",
          minWidth: "180px",
          border: "1px solid #ddd",
          fontFamily: "Roboto, Arial, sans-serif",
          zIndex: 1000,
        }}
      >
        {/* Header */}
        <div
          style={{
            borderBottom: "1px solid #ddd",
            marginBottom: "8px",
            padding: "10px",
            backgroundColor: "#f5f5f5",
            borderTopLeftRadius: "4px",
            borderTopRightRadius: "4px",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              marginBottom: "4px",
            }}
          >
            Site ID: {site?.siteId || "N/A"}
          </div>
          <div
            style={{
              fontSize: "14px",
            }}
          >
            Site Name: {site?.siteName || "N/A"}
          </div>
        </div>

        {/* Menu Items */}
        {/* <div
          className="menu-item"
          onClick={() => {
            onEdit(site);
            onClose();
          }}
          style={{
            padding: "10px 15px",
            cursor: "pointer",
            borderBottom: "1px solid #eee",
          }}
        >
          Edit Properties
        </div> */}
        {/* <div
          className="menu-item"
          onClick={() => {
            onDelete(site);
            onClose();
          }}
          style={{
            padding: "10px 15px",
            cursor: "pointer",
            borderBottom: "1px solid #eee",
          }}
        >
          Delete Site
        </div> */}
        {/* <div
          className="menu-item"
          onClick={() => {
            onAddPassiveElement(site);
            onClose();
          }}
          style={{
            padding: "10px 15px",
            cursor: "pointer",
            borderBottom: "1px solid #eee",
          }}
        >
          Add Passive Element
        </div> */}
        <div
          className="menu-item"
          onClick={() => {
            onShowInventoryReport(site);
            onClose();
          }}
          style={{
            padding: "10px 15px",
            cursor: "pointer",
            borderBottom: "1px solid #eee",
          }}
        >
          Show Inventory Report
        </div>
        <div
          className="menu-item"
          onClick={() => {
            onShowAssetHistory(site);
            onClose();
          }}
          style={{
            padding: "10px 15px",
            cursor: "pointer",
            borderBottom: "1px solid #eee",
          }}
        >
          Show Site History
        </div>
        {/* <div
          className="menu-item"
          onClick={() => {
            onShowNeLicenses(site);
            onClose();
          }}
          style={{
            padding: "10px 15px",
            cursor: "pointer",
            borderBottom: "1px solid #eee",
          }}
        >
          Show Associated NeLicenses Report
        </div> */}
      </div>
    </OverlayView>
  );
};

export default ContextMenuControl;
