export function getServerConfig() {
  return {
    port: process.env.PORT || 3000,
    server: process.env.SERVER || '0.0.0.0', // '0.0.0.0' будет доступен на всех интерфейсах
  };
}
