-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 07, 2026 at 02:57 PM
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
-- Database: `ecommerce_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` varchar(36) NOT NULL,
  `fullName` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phoneNumber` varchar(15) NOT NULL,
  `password` varchar(255) NOT NULL,
  `roles` enum('ADMIN','STAFF','CUSTOMER') NOT NULL DEFAULT 'CUSTOMER',
  `status` enum('ACTIVE','INACTIVE','DELETED') NOT NULL DEFAULT 'ACTIVE',
  `createdBy` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `otpExpiry` datetime DEFAULT NULL,
  `forgotPasswordCount` int(11) NOT NULL DEFAULT 0,
  `forgotPasswordResetAt` datetime DEFAULT NULL,
  `resendOtpCount` int(11) NOT NULL DEFAULT 0,
  `otpAttemptCount` int(11) NOT NULL DEFAULT 0,
  `isOtpVerified` tinyint(4) NOT NULL DEFAULT 0,
  `otp` varchar(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `fullName`, `email`, `phoneNumber`, `password`, `roles`, `status`, `createdBy`, `createdAt`, `updatedAt`, `otpExpiry`, `forgotPasswordCount`, `forgotPasswordResetAt`, `resendOtpCount`, `otpAttemptCount`, `isOtpVerified`, `otp`) VALUES
('468d6584-8009-4a7f-b410-741d9a44b5c7', 'Avi ', 'arijitsau18@gmail.com', '8989767432', '$2b$13$0uxjSCKzcYdsSorsCsfmF.z4zCJRqoEyQp7w/IUIJZ8eEhLQ7Ao.O', 'CUSTOMER', 'ACTIVE', NULL, '2026-08-03 12:12:06.528771', '2026-08-05 17:11:56.000000', '2026-08-05 16:51:06', 1, '2026-08-05 16:46:06', 0, 0, 0, '583445'),
('a54d9d46-51aa-4bed-8f88-4227a243d684', 'Arijit Sau', 'arijit@gmail.com', '9876543210', '$2b$13$nWXOJQeOAcaJKvuRGyn67.VCHXD1NAp6g/Am.aump99utqVnhrC8u', 'ADMIN', 'ACTIVE', NULL, '2026-08-02 08:51:54.961005', '2026-08-02 08:52:55.274311', NULL, 0, NULL, 0, 0, 0, NULL),
('dddf609d-5b35-4a9c-92ab-137a2800783c', 'Sujit Singh ', 'arijitsau67@gmail.com', '7070797650', '$2b$13$ni4CO3Q7mx/e8wbL4og0Zegf5NnrstUKTzQC7cWxBU5V4vsgF014e', 'CUSTOMER', 'ACTIVE', NULL, '2026-08-05 11:49:18.641783', '2026-08-05 16:30:28.000000', '2026-08-05 16:32:33', 3, '2026-08-05 16:27:33', 0, 0, 0, '649431');

-- --------------------------------------------------------

--
-- Table structure for table `address`
--

CREATE TABLE `address` (
  `id` varchar(36) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `phoneNumber` varchar(255) NOT NULL,
  `addressLine1` varchar(255) NOT NULL,
  `addressLine2` varchar(255) DEFAULT NULL,
  `city` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `postalCode` varchar(255) NOT NULL,
  `isDefault` tinyint(4) NOT NULL DEFAULT 0,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `accountId` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `address`
--

INSERT INTO `address` (`id`, `fullName`, `phoneNumber`, `addressLine1`, `addressLine2`, `city`, `state`, `country`, `postalCode`, `isDefault`, `createdAt`, `updatedAt`, `accountId`) VALUES
('0434ad4f-74e1-4c00-8447-f5856c2a9421', 'Avi shee', '8989767645', 'Medinipur College', 'Medinipur Station', 'Medinipur', 'West Bengal', 'India', '721437', 0, '2026-08-03 12:31:40.746546', '2026-08-03 12:31:40.746546', '468d6584-8009-4a7f-b410-741d9a44b5c7'),
('9b1981b7-4970-4c09-9bef-d7cd9e6158f0', 'Arijit Sau', '9876543210', 'NSHM Knowledge Campus', 'Near Muchipara', 'Durgapur', 'West Bengal', 'India', '700001', 1, '2026-08-02 10:52:45.782321', '2026-08-02 11:19:12.000000', 'a54d9d46-51aa-4bed-8f88-4227a243d684'),
('b6919790-da49-4338-b4e7-724f580bbcfe', 'Sujit Singh', '7077996443', 'Durgapur', 'B C ROY College', 'Durgapur', 'West Bengal', 'India', '721460', 0, '2026-08-05 12:26:32.431267', '2026-08-05 12:26:32.431267', 'dddf609d-5b35-4a9c-92ab-137a2800783c');

-- --------------------------------------------------------

--
-- Table structure for table `brand`
--

CREATE TABLE `brand` (
  `id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','DELETED') NOT NULL DEFAULT 'ACTIVE',
  `createdBy` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `brand`
--

INSERT INTO `brand` (`id`, `name`, `slug`, `image`, `status`, `createdBy`, `createdAt`, `updatedAt`) VALUES
('2c823f00-c009-4501-b714-934f6af7b922', 'Apple', 'apple', 'apple.png', 'ACTIVE', 'a54d9d46-51aa-4bed-8f88-4227a243d684', '2026-08-03 18:33:41.821742', '2026-08-03 18:33:41.821742'),
('47a3f815-8074-43ba-b98e-6e9b552b21d0', 'Samsung', 'samsung', 'samsung.png', 'DELETED', '[object Object]', '2026-08-02 09:04:20.164891', '2026-08-02 09:12:16.000000'),
('4f505945-a6ee-4865-8dfa-1e391916a50f', 'ViVO', 'vivo', 'http://localhost:3000/uploads/brand/1786011455356-207997298.png', 'ACTIVE', 'a54d9d46-51aa-4bed-8f88-4227a243d684', '2026-08-06 15:47:35.379586', '2026-08-06 15:47:35.379586'),
('5da7cebe-4e85-4bee-ac70-4288aff345e1', 'Realme', 'realme', 'http://localhost:3000/uploads/brand/1785823986223-382118120.png', 'ACTIVE', 'a54d9d46-51aa-4bed-8f88-4227a243d684', '2026-08-04 11:43:06.239307', '2026-08-04 11:43:06.239307'),
('e8104d43-a23f-466a-84d8-aa7157b7a823', 'OPPO', 'oppo', 'http://localhost:3000/uploads/brand/1786084123823-486630872.png', 'ACTIVE', 'a54d9d46-51aa-4bed-8f88-4227a243d684', '2026-08-07 11:58:43.850682', '2026-08-07 11:58:43.850682');

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` varchar(36) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `accountId` varchar(36) DEFAULT NULL,
  `productId` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','DELETED') NOT NULL DEFAULT 'ACTIVE',
  `createdBy` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `image`, `status`, `createdBy`, `createdAt`, `updatedAt`) VALUES
('5bed5907-65bf-4ab6-8504-b155878b5440', 'Electronics', 'electronics', 'electronics.png', 'ACTIVE', '[object Object]', '2026-08-02 08:59:14.802526', '2026-08-02 08:59:14.802526'),
('c54374c3-3403-4ebb-b5b0-264a50d1795a', 'Fashion', 'fashion', 'http://localhost:3000/uploads/category/1785822115716-698292567.png', 'ACTIVE', 'a54d9d46-51aa-4bed-8f88-4227a243d684', '2026-08-04 11:11:55.743024', '2026-08-04 11:11:55.743024');

-- --------------------------------------------------------

--
-- Table structure for table `coupon`
--

CREATE TABLE `coupon` (
  `id` varchar(36) NOT NULL,
  `code` varchar(255) NOT NULL,
  `discount` decimal(10,2) NOT NULL,
  `expiryDate` datetime NOT NULL,
  `isActive` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `minimumOrderAmount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `maximumDiscount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `usageLimit` int(11) NOT NULL DEFAULT 100,
  `usedCount` int(11) NOT NULL DEFAULT 0,
  `firstOrderOnly` tinyint(4) NOT NULL DEFAULT 0,
  `type` enum('PERCENTAGE','FIXED') NOT NULL DEFAULT 'PERCENTAGE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coupon`
--

INSERT INTO `coupon` (`id`, `code`, `discount`, `expiryDate`, `isActive`, `createdAt`, `updatedAt`, `minimumOrderAmount`, `maximumDiscount`, `usageLimit`, `usedCount`, `firstOrderOnly`, `type`) VALUES
('9fd86de9-8359-4f97-b222-cfff4da535a7', 'FIRST50', 50.00, '2027-12-31 00:00:00', 1, '2026-08-07 15:37:16.203609', '2026-08-07 15:37:26.000000', 100.00, 500.00, 100, 1, 1, 'PERCENTAGE'),
('ab838511-3d94-4b56-9b8a-a9e299ad9e97', 'OLD10', 10.00, '2025-01-01 00:00:00', 1, '2026-08-07 15:29:08.127645', '2026-08-07 15:29:08.127645', 100.00, 500.00, 100, 0, 0, 'PERCENTAGE'),
('beb4f07a-fd43-4c5b-8be3-3aa5b60230f8', 'SAVE10', 10.00, '2027-12-31 00:00:00', 1, '2026-08-07 15:19:52.049404', '2026-08-07 15:58:01.000000', 500.00, 1000.00, 100, 2, 0, 'PERCENTAGE');

-- --------------------------------------------------------

--
-- Table structure for table `menu`
--

CREATE TABLE `menu` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `title` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu`
--

INSERT INTO `menu` (`id`, `name`, `title`) VALUES
(1, 'account', 'Account'),
(2, 'category', 'Category'),
(3, 'brand', 'Brand'),
(4, 'product', 'Product'),
(5, 'order', 'Order'),
(6, 'dashboard', 'Dashboard');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` varchar(36) NOT NULL,
  `totalAmount` decimal(10,2) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `accountId` varchar(36) DEFAULT NULL,
  `addressId` varchar(36) DEFAULT NULL,
  `status` enum('PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `discountAmount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `finalAmount` decimal(10,2) NOT NULL,
  `couponCode` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `totalAmount`, `createdAt`, `updatedAt`, `accountId`, `addressId`, `status`, `discountAmount`, `finalAmount`, `couponCode`) VALUES
('42fdc168-ff24-4147-a28e-591b9b858cb4', 24000.00, '2026-08-07 15:25:43.096549', '2026-08-07 15:25:43.096549', '468d6584-8009-4a7f-b410-741d9a44b5c7', '0434ad4f-74e1-4c00-8447-f5856c2a9421', 'PENDING', 1000.00, 23000.00, 'SAVE10'),
('9a2fef00-9799-4807-aa2b-8bb3aafa1abf', 75999.00, '2026-08-03 12:33:23.978910', '2026-08-04 13:15:34.000000', '468d6584-8009-4a7f-b410-741d9a44b5c7', '0434ad4f-74e1-4c00-8447-f5856c2a9421', 'CONFIRMED', 0.00, 0.00, NULL),
('9b31fdc2-f2ee-4610-b0f1-44ffa11b6514', 65000.00, '2026-08-07 15:58:01.297831', '2026-08-07 15:58:01.297831', '468d6584-8009-4a7f-b410-741d9a44b5c7', '0434ad4f-74e1-4c00-8447-f5856c2a9421', 'PENDING', 1000.00, 64000.00, 'SAVE10'),
('a491b577-0cf5-47fe-8e90-d6b6a15dd0a2', 48000.00, '2026-08-05 12:28:20.271350', '2026-08-05 12:28:20.271350', 'dddf609d-5b35-4a9c-92ab-137a2800783c', 'b6919790-da49-4338-b4e7-724f580bbcfe', 'PENDING', 0.00, 0.00, NULL),
('aff47941-241a-4e8d-9335-67c923febe6d', 151998.00, '2026-08-02 12:45:11.000817', '2026-08-04 12:42:56.000000', 'a54d9d46-51aa-4bed-8f88-4227a243d684', '9b1981b7-4970-4c09-9bef-d7cd9e6158f0', 'SHIPPED', 0.00, 0.00, NULL),
('df0b1ca4-3af0-468f-81b2-5470c5f23332', 130000.00, '2026-08-06 15:59:31.192180', '2026-08-06 15:59:31.192180', 'dddf609d-5b35-4a9c-92ab-137a2800783c', 'b6919790-da49-4338-b4e7-724f580bbcfe', 'PENDING', 0.00, 0.00, NULL),
('f12e9512-7178-4fb2-8f9c-51e4bb61b38b', 72000.00, '2026-08-06 11:00:01.584639', '2026-08-06 11:00:01.584639', 'dddf609d-5b35-4a9c-92ab-137a2800783c', 'b6919790-da49-4338-b4e7-724f580bbcfe', 'PENDING', 0.00, 0.00, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_item`
--

CREATE TABLE `order_item` (
  `id` varchar(36) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `orderId` varchar(36) DEFAULT NULL,
  `productId` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_item`
--

INSERT INTO `order_item` (`id`, `quantity`, `price`, `orderId`, `productId`) VALUES
('2b1933ac-5c67-44f5-a764-c87d7d014954', 1, 65000.00, '9b31fdc2-f2ee-4610-b0f1-44ffa11b6514', '5fa8fa5a-4398-4dbe-8d4f-008cd962312c'),
('3dc2c0c6-36d3-43ac-bedd-4430d54d0f90', 2, 65000.00, 'df0b1ca4-3af0-468f-81b2-5470c5f23332', '5fa8fa5a-4398-4dbe-8d4f-008cd962312c'),
('3e6c8d9c-ab1f-4ef5-b201-dccbf3c326bb', 2, 75999.00, 'aff47941-241a-4e8d-9335-67c923febe6d', '1fba78b0-c138-400f-86ad-4478badc979f'),
('442d842e-5abf-4d88-aecf-eda237c346d1', 1, 75999.00, '9a2fef00-9799-4807-aa2b-8bb3aafa1abf', '1fba78b0-c138-400f-86ad-4478badc979f'),
('7778ad22-a6f1-4302-a07e-5a4236048bca', 2, 24000.00, 'a491b577-0cf5-47fe-8e90-d6b6a15dd0a2', '71af227d-16d5-427a-9115-21cd207e76d5'),
('bfb802bb-cd45-4aa3-9a2a-8a6c38df5261', 3, 24000.00, 'f12e9512-7178-4fb2-8f9c-51e4bb61b38b', '71af227d-16d5-427a-9115-21cd207e76d5'),
('c10db2bd-5f0c-474e-9d98-9164ee77482e', 1, 24000.00, '42fdc168-ff24-4147-a28e-591b9b858cb4', '71af227d-16d5-427a-9115-21cd207e76d5');

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `id` varchar(36) NOT NULL,
  `razorpayOrderId` varchar(255) NOT NULL,
  `razorpayPaymentId` varchar(255) DEFAULT NULL,
  `razorpaySignature` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(255) NOT NULL DEFAULT 'INR',
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `orderId` varchar(36) DEFAULT NULL,
  `status` enum('PENDING','SUCCESS','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permission`
--

CREATE TABLE `permission` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permission`
--

INSERT INTO `permission` (`id`, `name`) VALUES
(1, 'Create'),
(4, 'Delete'),
(2, 'Read'),
(3, 'Update');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` varchar(36) NOT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `status` enum('ACTIVE','INACTIVE','DELETED') NOT NULL DEFAULT 'ACTIVE',
  `categoryId` varchar(255) NOT NULL,
  `brandId` varchar(255) NOT NULL,
  `createdBy` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `name`, `slug`, `description`, `image`, `price`, `stock`, `status`, `categoryId`, `brandId`, `createdBy`, `createdAt`, `updatedAt`) VALUES
('1fba78b0-c138-400f-86ad-4478badc979f', 'S 26', 's-26', 'Samsung flagship smartphone', 's26.png', 75999.00, 30, 'DELETED', '5bed5907-65bf-4ab6-8504-b155878b5440', '47a3f815-8074-43ba-b98e-6e9b552b21d0', '[object Object]', '2026-08-02 09:43:52.715904', '2026-08-02 09:52:45.000000'),
('5fa8fa5a-4398-4dbe-8d4f-008cd962312c', 'VIVO X200', 'vivo-x200', 'VIVO flagship phone', 'http://localhost:3000/uploads/product/1786011779418-149401618.png', 65000.00, 1, 'ACTIVE', '5bed5907-65bf-4ab6-8504-b155878b5440', '4f505945-a6ee-4865-8dfa-1e391916a50f', 'a54d9d46-51aa-4bed-8f88-4227a243d684', '2026-08-06 15:52:59.437702', '2026-08-07 15:58:01.000000'),
('71af227d-16d5-427a-9115-21cd207e76d5', 'Realme P4', 'realme-p4', 'Realme Budget Friendly ', 'http://localhost:3000/uploads/product/1785910982963-377994244.png', 24000.00, 4, 'ACTIVE', '5bed5907-65bf-4ab6-8504-b155878b5440', '5da7cebe-4e85-4bee-ac70-4288aff345e1', 'a54d9d46-51aa-4bed-8f88-4227a243d684', '2026-08-05 11:53:02.985656', '2026-08-07 15:25:43.000000'),
('ad1221b2-2e5b-444a-ba0a-fc97ec1425c5', 'iPhone 17 Pro', 'iphone-17-pro', 'Apple flagship ', 'http://localhost:3000/uploads/product/1785822882644-549486535.png', 140000.00, 13, 'ACTIVE', '5bed5907-65bf-4ab6-8504-b155878b5440', '2c823f00-c009-4501-b714-934f6af7b922', 'a54d9d46-51aa-4bed-8f88-4227a243d684', '2026-08-04 11:24:42.664410', '2026-08-04 11:24:42.664410'),
('c528811e-38c0-4ac6-91da-ab915147cd2d', 'iPhone 17 ', 'iphone-17', 'Apple flagship ', 'http://localhost:3000/uploads/product/1785823145695-398943346.png', 79999.00, 9, 'ACTIVE', '5bed5907-65bf-4ab6-8504-b155878b5440', '2c823f00-c009-4501-b714-934f6af7b922', 'a54d9d46-51aa-4bed-8f88-4227a243d684', '2026-08-04 11:29:05.705404', '2026-08-04 11:29:05.705404');

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `id` varchar(36) NOT NULL,
  `rating` int(11) NOT NULL,
  `review` text DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `accountId` varchar(36) DEFAULT NULL,
  `productId` varchar(36) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `review`
--

INSERT INTO `review` (`id`, `rating`, `review`, `createdAt`, `updatedAt`, `accountId`, `productId`, `image`) VALUES
('7ff0f14c-98ce-4378-8c03-d31be4012b7b', 4, 'Excellent Product', '2026-08-04 10:18:48.556830', '2026-08-04 10:18:48.556830', 'a54d9d46-51aa-4bed-8f88-4227a243d684', '1fba78b0-c138-400f-86ad-4478badc979f', 'http://localhost:3000/uploads/1785818928510-42814474.png');

-- --------------------------------------------------------

--
-- Table structure for table `user_permission`
--

CREATE TABLE `user_permission` (
  `id` int(11) NOT NULL,
  `accountId` varchar(255) DEFAULT NULL,
  `menuId` int(11) DEFAULT NULL,
  `permissionId` int(11) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_permission`
--

INSERT INTO `user_permission` (`id`, `accountId`, `menuId`, `permissionId`, `status`, `updatedAt`) VALUES
(21, 'a54d9d46-51aa-4bed-8f88-4227a243d684', 1, 1, 1, '2026-08-02 08:54:53.419613'),
(22, 'a54d9d46-51aa-4bed-8f88-4227a243d684', 1, 2, 1, '2026-08-02 08:54:53.419613'),
(23, 'a54d9d46-51aa-4bed-8f88-4227a243d684', 1, 3, 1, '2026-08-02 08:54:53.419613'),
(24, 'a54d9d46-51aa-4bed-8f88-4227a243d684', 1, 4, 1, '2026-08-02 08:54:53.419613'),
(25, 'a54d9d46-51aa-4bed-8f88-4227a243d684', 2, 1, 1, '2026-08-02 08:54:53.419613'),
(26, 'a54d9d46-51aa-4bed-8f88-4227a243d684', 2, 2, 1, '2026-08-02 08:54:53.419613'),
(27, 'a54d9d46-51aa-4bed-8f88-4227a243d684', 2, 3, 1, '2026-08-02 08:54:53.419613'),
(28, 'a54d9d46-51aa-4bed-8f88-4227a243d684', 2, 4, 1, '2026-08-02 08:54:53.419613'),
(29, 'a54d9d46-51aa-4bed-8f88-4227a243d684', 3, 1, 1, '2026-08-02 08:54:53.419613'),
(30, 'a54d9d46-51aa-4bed-8f88-4227a243d684', 3, 2, 1, '2026-08-02 08:54:53.419613'),
(31, 'a54d9d46-51aa-4bed-8f88-4227a243d684', 3, 3, 1, '2026-08-02 08:54:53.419613'),
(32, 'a54d9d46-51aa-4bed-8f88-4227a243d684', 3, 4, 1, '2026-08-02 08:54:53.419613'),
(33, 'a54d9d46-51aa-4bed-8f88-4227a243d684', 4, 1, 1, '2026-08-02 08:54:53.419613'),
(34, 'a54d9d46-51aa-4bed-8f88-4227a243d684', 4, 2, 1, '2026-08-02 08:54:53.419613'),
(35, 'a54d9d46-51aa-4bed-8f88-4227a243d684', 4, 3, 1, '2026-08-02 08:54:53.419613'),
(36, 'a54d9d46-51aa-4bed-8f88-4227a243d684', 4, 4, 1, '2026-08-02 08:54:53.419613'),
(37, 'a54d9d46-51aa-4bed-8f88-4227a243d684', 5, 1, 1, '2026-08-02 08:54:53.419613'),
(38, 'a54d9d46-51aa-4bed-8f88-4227a243d684', 5, 2, 1, '2026-08-02 08:54:53.419613'),
(39, 'a54d9d46-51aa-4bed-8f88-4227a243d684', 5, 3, 1, '2026-08-02 08:54:53.419613'),
(40, 'a54d9d46-51aa-4bed-8f88-4227a243d684', 5, 4, 1, '2026-08-02 08:54:53.419613'),
(41, 'a54d9d46-51aa-4bed-8f88-4227a243d684', 6, 2, 1, '2026-08-04 15:02:20.632176');

-- --------------------------------------------------------

--
-- Table structure for table `wishlist`
--

CREATE TABLE `wishlist` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `accountId` varchar(36) DEFAULT NULL,
  `productId` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_ee66de6cdc53993296d1ceb8aa` (`email`),
  ADD UNIQUE KEY `IDX_36034b22cee2803dc9a510dce0` (`phoneNumber`);

--
-- Indexes for table `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_b46b132f3f3f727522cf8eb40cc` (`accountId`);

--
-- Indexes for table `brand`
--
ALTER TABLE `brand`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_5f468ae5696f07da025138e38f` (`name`),
  ADD UNIQUE KEY `IDX_f4436285f5d5785c7fb0b28b30` (`slug`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_61fe7aa8bf77c2c1800793cf36e` (`accountId`),
  ADD KEY `FK_371eb56ecc4104c2644711fa85f` (`productId`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_8b0be371d28245da6e4f4b6187` (`name`),
  ADD UNIQUE KEY `IDX_420d9f679d41281f282f5bc7d0` (`slug`);

--
-- Indexes for table `coupon`
--
ALTER TABLE `coupon`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_62d3c5b0ce63a82c48e86d904b` (`code`);

--
-- Indexes for table `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_51b63874cdce0d6898a0b2150f` (`name`),
  ADD UNIQUE KEY `IDX_f29781ef48d93c714e1c592a12` (`title`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_8c38e56ab9c50303cc74e84c42a` (`accountId`),
  ADD KEY `FK_37636d260931dcf46d11892f614` (`addressId`);

--
-- Indexes for table `order_item`
--
ALTER TABLE `order_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_646bf9ece6f45dbe41c203e06e0` (`orderId`),
  ADD KEY `FK_904370c093ceea4369659a3c810` (`productId`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_d09d285fe1645cd2f0db811e293` (`orderId`);

--
-- Indexes for table `permission`
--
ALTER TABLE `permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_240853a0c3353c25fb12434ad3` (`name`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_22cc43e9a74d7498546e9a63e7` (`name`),
  ADD UNIQUE KEY `IDX_8cfaf4a1e80806d58e3dbe6922` (`slug`),
  ADD KEY `FK_ff0c0301a95e517153df97f6812` (`categoryId`),
  ADD KEY `FK_bb7d3d9dc1fae40293795ae39d6` (`brandId`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_cfe234d68b9ec0aac262881f2ca` (`accountId`),
  ADD KEY `FK_2a11d3c0ea1b2b5b1790f762b9a` (`productId`);

--
-- Indexes for table `user_permission`
--
ALTER TABLE `user_permission`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_344be4cbbe3c14a1b4fa111e152` (`accountId`),
  ADD KEY `FK_ecd93ebf7df98c1d09613171e97` (`menuId`),
  ADD KEY `FK_a592f2df24c9d464afd71401ff6` (`permissionId`);

--
-- Indexes for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_0cb875f467b33098f3602a31898` (`accountId`),
  ADD KEY `FK_17e00e49d77ccaf7ff0e14de37b` (`productId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `menu`
--
ALTER TABLE `menu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `permission`
--
ALTER TABLE `permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user_permission`
--
ALTER TABLE `user_permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `address`
--
ALTER TABLE `address`
  ADD CONSTRAINT `FK_b46b132f3f3f727522cf8eb40cc` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `FK_371eb56ecc4104c2644711fa85f` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_61fe7aa8bf77c2c1800793cf36e` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `FK_37636d260931dcf46d11892f614` FOREIGN KEY (`addressId`) REFERENCES `address` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_8c38e56ab9c50303cc74e84c42a` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `order_item`
--
ALTER TABLE `order_item`
  ADD CONSTRAINT `FK_646bf9ece6f45dbe41c203e06e0` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_904370c093ceea4369659a3c810` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `FK_d09d285fe1645cd2f0db811e293` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `FK_bb7d3d9dc1fae40293795ae39d6` FOREIGN KEY (`brandId`) REFERENCES `brand` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_ff0c0301a95e517153df97f6812` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `FK_2a11d3c0ea1b2b5b1790f762b9a` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_cfe234d68b9ec0aac262881f2ca` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `user_permission`
--
ALTER TABLE `user_permission`
  ADD CONSTRAINT `FK_344be4cbbe3c14a1b4fa111e152` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_a592f2df24c9d464afd71401ff6` FOREIGN KEY (`permissionId`) REFERENCES `permission` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_ecd93ebf7df98c1d09613171e97` FOREIGN KEY (`menuId`) REFERENCES `menu` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD CONSTRAINT `FK_0cb875f467b33098f3602a31898` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_17e00e49d77ccaf7ff0e14de37b` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
