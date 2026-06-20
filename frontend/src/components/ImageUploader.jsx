import React, { useRef, useState } from 'react';

const ADMIN_KEY = "bla_admin_token";

const ImageUploader = ({ onUploadSuccess, multiple = false, buttonText = "Upload Image" }) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!multiple && files.length > 1) {
      setError("Please select only 1 image.");
      return;
    }

    setIsUploading(true);
    setError(null);

    const token = localStorage.getItem(ADMIN_KEY);
    if (!token) {
      setError("Unauthorized. Please log in again.");
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      const response = await fetch('/upload-proxy', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.urls && data.urls.length > 0) {
        onUploadSuccess(data.urls);
      } else {
        setError("No URLs returned from server.");
      }
    } catch (err) {
      console.error("Image upload error:", err);
      setError("Failed to upload image(s).");
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be uploaded again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <input
        type="file"
        multiple={multiple}
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/*"
      />
      <button
        type="button"
        className="btn ghost cursor-target"
        style={{ padding: "6px 12px", fontSize: "0.85rem" }}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        disabled={isUploading}
      >
        {isUploading ? "Uploading..." : buttonText}
      </button>
      {error && <span style={{ color: "var(--deep-red)", fontSize: "0.85rem" }}>{error}</span>}
    </div>
  );
};

export default ImageUploader;
