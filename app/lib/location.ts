export async function getLocation(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
          resolve({
            latitude: data.latitude,
            longitude: data.longitude,
          });
        })
        .catch(() => {
          reject(new Error('Geolocation is not supported by your browser and IP location fetch failed'));
        });
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
              resolve({
                latitude: data.latitude,
                longitude: data.longitude,
              });
            })
            .catch(() => {
              reject(new Error('Failed to fetch location via geolocation and IP location fetch failed'));
            });
        }
      );
    }
  });
}
