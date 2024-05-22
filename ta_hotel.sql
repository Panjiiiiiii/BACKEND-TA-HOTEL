-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 05, 2024 at 03:56 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ta_hotel`
--

-- --------------------------------------------------------

--
-- Table structure for table `detail_pemesanans`
--

CREATE TABLE `detail_pemesanans` (
  `id` int(11) NOT NULL,
  `id_pemesanan` int(11) DEFAULT NULL,
  `id_kamar` int(11) DEFAULT NULL,
  `tgl_akses` datetime DEFAULT NULL,
  `harga` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kamars`
--

CREATE TABLE `kamars` (
  `id` int(11) NOT NULL,
  `nomor_kamar` int(11) DEFAULT NULL,
  `id_tipe_kamar` int(11) DEFAULT NULL,
  `status` enum('avalaible','booked') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kamars`
--

INSERT INTO `kamars` (`id`, `nomor_kamar`, `id_tipe_kamar`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 101, 1, 'avalaible', '2024-03-30 01:36:09', '2024-03-30 01:36:09'),
(2, 102, 1, 'avalaible', '2024-03-30 01:36:16', '2024-03-30 01:36:16'),
(3, 103, 1, 'avalaible', '2024-03-30 01:36:20', '2024-03-30 01:36:20'),
(4, 104, 1, 'avalaible', '2024-03-30 01:36:23', '2024-03-30 01:36:23'),
(5, 105, 1, 'avalaible', '2024-03-30 01:36:26', '2024-03-30 01:36:26'),
(6, 201, 2, 'avalaible', '2024-03-30 01:36:33', '2024-03-30 01:36:33'),
(7, 202, 2, 'avalaible', '2024-03-30 01:36:36', '2024-03-30 01:36:36'),
(8, 203, 2, 'avalaible', '2024-03-30 01:36:38', '2024-03-30 01:36:38'),
(9, 204, 2, 'avalaible', '2024-03-30 01:36:41', '2024-03-30 01:36:41'),
(10, 205, 2, 'avalaible', '2024-03-30 01:36:44', '2024-03-30 01:36:44'),
(11, 301, 3, 'avalaible', '2024-03-30 01:36:51', '2024-03-30 01:36:51'),
(12, 302, 3, 'avalaible', '2024-03-30 01:36:54', '2024-03-30 01:36:54'),
(13, 303, 3, 'avalaible', '2024-03-30 01:36:56', '2024-03-30 01:36:56'),
(14, 304, 3, 'avalaible', '2024-03-30 01:36:59', '2024-03-30 01:36:59'),
(15, 305, 3, 'avalaible', '2024-03-30 01:37:01', '2024-03-30 01:37:01');

-- --------------------------------------------------------

--
-- Table structure for table `pemesanans`
--

CREATE TABLE `pemesanans` (
  `id` int(11) NOT NULL,
  `nomor_pemesanan` int(11) DEFAULT NULL,
  `tgl_pemesanan` datetime DEFAULT NULL,
  `tgl_check_in` datetime DEFAULT NULL,
  `tgl_check_out` datetime DEFAULT NULL,
  `nama_tamu` varchar(255) DEFAULT NULL,
  `jumlah_kamar` int(11) DEFAULT NULL,
  `id_tipe_kamar` int(11) DEFAULT NULL,
  `status_pemesanan` enum('baru','check_in','check_out') DEFAULT NULL,
  `id_user` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20240107161956-create-user.js'),
('20240107162818-create-tipe-kamar.js'),
('20240107162932-create-kamar.js'),
('20240107163542-create-pemesanan.js'),
('20240107163700-create-detail-pemesanan.js');

-- --------------------------------------------------------

--
-- Table structure for table `tipe_kamars`
--

CREATE TABLE `tipe_kamars` (
  `id` int(11) NOT NULL,
  `nama_tipe_kamar` varchar(255) DEFAULT NULL,
  `harga` int(11) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `foto` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tipe_kamars`
--

INSERT INTO `tipe_kamars` (`id`, `nama_tipe_kamar`, `harga`, `deskripsi`, `foto`, `createdAt`, `updatedAt`) VALUES
(1, 'Premium', 250000, 'Full AC, luas, single bed', 'img-1711762519764.jpg', '2024-03-30 01:35:19', '2024-03-30 01:35:19'),
(2, 'Single bed', 150000, 'Full AC, luas, single bed', 'img-1711762530982.jpg', '2024-03-30 01:35:30', '2024-03-30 01:35:30'),
(3, 'Luxury', 100000, 'Full AC, luas, single bed', 'img-1711762545402.jpg', '2024-03-30 01:35:45', '2024-03-30 01:35:45');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `foto` text DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` text DEFAULT NULL,
  `role` enum('admin','customer') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `foto`, `username`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
(3, 'img-1711762360565.jpg', 'adminnnnn', 'adminwaria@gmail.com', '$2b$10$0fx0WSYkFmblISaiK4cCCOn.bEStBCoyIAol5WIisFGX32rrRGRgW', 'admin', '2024-03-30 01:32:40', '2024-03-30 01:32:40'),
(4, 'img-1711762363443.jpg', 'newUser', 'user@gmail.com', '$2b$10$yA47neiNnzc1m3FBDOVkgu3XynBTBMHcpWU1NyGl24NyR3e5Uu7zC', 'customer', '2024-03-30 01:32:43', '2024-03-30 01:32:43');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `detail_pemesanans`
--
ALTER TABLE `detail_pemesanans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pemesanan` (`id_pemesanan`),
  ADD KEY `id_kamar` (`id_kamar`);

--
-- Indexes for table `kamars`
--
ALTER TABLE `kamars`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_tipe_kamar` (`id_tipe_kamar`);

--
-- Indexes for table `pemesanans`
--
ALTER TABLE `pemesanans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_tipe_kamar` (`id_tipe_kamar`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `tipe_kamars`
--
ALTER TABLE `tipe_kamars`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `detail_pemesanans`
--
ALTER TABLE `detail_pemesanans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kamars`
--
ALTER TABLE `kamars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `pemesanans`
--
ALTER TABLE `pemesanans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tipe_kamars`
--
ALTER TABLE `tipe_kamars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `detail_pemesanans`
--
ALTER TABLE `detail_pemesanans`
  ADD CONSTRAINT `detail_pemesanans_ibfk_1` FOREIGN KEY (`id_pemesanan`) REFERENCES `pemesanans` (`id`),
  ADD CONSTRAINT `detail_pemesanans_ibfk_2` FOREIGN KEY (`id_kamar`) REFERENCES `kamars` (`id`);

--
-- Constraints for table `kamars`
--
ALTER TABLE `kamars`
  ADD CONSTRAINT `kamars_ibfk_1` FOREIGN KEY (`id_tipe_kamar`) REFERENCES `tipe_kamars` (`id`);

--
-- Constraints for table `pemesanans`
--
ALTER TABLE `pemesanans`
  ADD CONSTRAINT `pemesanans_ibfk_1` FOREIGN KEY (`id_tipe_kamar`) REFERENCES `tipe_kamars` (`id`),
  ADD CONSTRAINT `pemesanans_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
