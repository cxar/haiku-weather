export default function GlassOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-10"
      style={{
        backdropFilter: 'blur(20px) saturate(120%)',
        WebkitBackdropFilter: 'blur(20px) saturate(120%)',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        backgroundImage:
          'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB+UlEQVQ4jaWTTU8CURiFv7d9mI7GaXJpmWSeJBjlTRMyh6I1HSSFeJgEpiIC4nUtWBJbDk7iQF3UXkjgkFROCIJpZ3WVzywoNMTNfbn3efi/S37vu959x7vff++5+dUZJWk3sB2YOsyyytQvKRvcMDp5e23z/fTO4gYPplQDPmB47jqpR/sR1VX0O19QIRkJJrXqkCmu6c4ugXIZPqDhxTWHdPXgFkw1MFCmc+K7EufY72BDclWWSzzAFmjzMWfYfA9ZP/380ZhSIlqJELVQ7SdMG4BktQ8xTDuA8g+ZUM0CbERizirMY+o4Bc/ZletXI5preNezmyXMlXU7xB+FhQ51UFRv1Nf6ptKQVmrK+IDTSu0dCGctskdBYBnJ0x3Kd8m6Qay3FgImkpcQ5F3jUc3mTDo1s6muAnf2YQPt3B2PGtbJS0MKQGaTvO7KMLETRNm2SPp8lUSs8lYntEMDLm+tFqy7Y6SDvFWwju/ymh2XyIdKoI9RYIkwX4FbgdBoMZHEyZkBZ7bXA3Nss1pUci5XZ1uE7+eMZFdzL2rMjU6u46i2jo0OFoAclmV5i6gSXXkEPzbTKMkoQkgkzM7GaXsjN+MXhkzNbm6ywaVPukzsBgtC2vxzQhe+wPnT0g2W6ZFfxxJu1/OmTueUi3s8aW2bawmB0eEHAF13Wd6FGGvJwAAAABJRU5ErkJggg==")',
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 200px',
      }}
    />
  );
} 