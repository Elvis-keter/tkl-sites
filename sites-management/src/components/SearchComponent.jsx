import React, { useRef, useEffect } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const SearchComponent = React.memo(({ searchTerm, setSearchTerm, loading }) => {
  const inputRef = useRef(null);

  // Focus maintenance effect
  useEffect(() => {
    // Store if input was focused before the update
    const wasFocused = document.activeElement === inputRef.current;

    // After render, if it was focused, restore focus
    if (wasFocused && inputRef.current) {
      inputRef.current.focus();
    }
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 8,
        zIndex: 1000,
        width: "320px",
      }}
    >
      <TextField
        inputRef={inputRef}
        fullWidth
        variant="outlined"
        size="small"
        placeholder="Search sites by ID or name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          borderRadius: "10px",
          backgroundColor: "white",
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#ccc" },
            "&:hover fieldset": { borderColor: "#999" },
            "&.Mui-focused fieldset": { borderColor: "#00AACA" },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <>
              {searchTerm ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSearchTerm("");
                      // Keep focus on input after clearing
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null}
            </>
          ),
        }}
      />
    </div>
  );
});

export default SearchComponent;
