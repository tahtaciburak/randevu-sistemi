-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Anamakine: localhost
-- Üretim Zamanı: 23 Nis 2018, 21:51:31
-- Sunucu sürümü: 10.1.21-MariaDB
-- PHP Sürümü: 7.0.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `calendar`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `Appointments`
--

CREATE TABLE Appointments (
  AppointmentID int(11) NOT NULL auto_increment,
  HostID int(11) NOT NULL,
  GuestID int(11),
  StartDateTime datetime NOT NULL,
  Length int(11) NOT NULL,
  AppointmentStatus int(11) NOT NULL,
  AppointmentHeader varchar(100) DEFAULT NULL,
  AppointmentDescription varchar(1000) DEFAULT NULL,
  Location varchar(100) NOT NULL,
  PeriodCount int(11),
  primary key(AppointmentID)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
--
-- Tablo döküm verisi `Appointments`
--

INSERT INTO `Appointments` (`AppointmentID`, `HostID`, `GuestID`, `StartDateTime`, `Length`, `AppointmentStatus`, `AppointmentHeader`, `AppointmentDescription`, `PeriodCount`) VALUES
(1, 1, 2, '2018-04-04 00:00:00', 15, 1, 'Deneme', 'Deneme tanimi', 0),
(2, 2, 1, '2018-04-12 00:00:00', 1, 4, 'asdfsadf', 'asdfasdf', 0);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` char(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Tablo döküm verisi `users`
--

INSERT INTO `users` (`id`, `username`, `password`) VALUES
(1, 'b', '$2a$10$WmbuoKikxtW7hSW.vPbZiOdvktPJuLEBXPMFwMdkuQ6myN01up9P2'),
(2, 'hibestilburak', '$2a$10$A/M2kMoNlZ4YxTtr7C3mmeOObJ5VMHWB2joqmpOOZiPPpgqFLXBYC');

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `Appointments`
--

--
-- Tablo için indeksler `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_UNIQUE` (`id`),
  ADD UNIQUE KEY `username_UNIQUE` (`username`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `Appointments`
--
--
-- Tablo için AUTO_INCREMENT değeri `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
