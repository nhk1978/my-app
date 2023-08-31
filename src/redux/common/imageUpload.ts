import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const imageUpload = createAsyncThunk(
    "imageUpload",
    async (file: File) => {
        const result = await axios.post("https://api.escuelajs.co/api/v1/files/upload", {
            file
        })
    }
)