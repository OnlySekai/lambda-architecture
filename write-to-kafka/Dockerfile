# Chọn base image
FROM node:alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt các phụ thuộc
RUN npm install

# Sao chép mã nguồn ứng dụng vào container
COPY . .

# Mở cổng 3000
EXPOSE 3000

# Chạy ứng dụng
CMD ["node", "index.js"]