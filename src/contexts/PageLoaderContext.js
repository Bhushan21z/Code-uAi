import { createContext, useState, useContext } from "react";
import { CircularProgress, Box } from "@mui/material";

const PageLoaderContext = createContext();

export const PageLoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <PageLoaderContext.Provider value={{ loading, setLoading }}>
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <CircularProgress sx={{ color: "#fff" }} />
        </Box>
      )}
      {children}
    </PageLoaderContext.Provider>
  );
};

export const usePageLoader = () => useContext(PageLoaderContext);
