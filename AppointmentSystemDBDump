CREATE TABLE `Appointments` (
  `appointmentID` int(11) NOT NULL AUTO_INCREMENT,
  `takerID` int(11) unsigned DEFAULT NULL,
  `giverID` int(11) unsigned NOT NULL,
  `status` int(11) NOT NULL,
  `startDate` datetime NOT NULL,
  `length` int(11) NOT NULL,
  `description` varchar(500) NOT NULL,
  `header` varchar(200) NOT NULL,
  PRIMARY KEY (`appointmentID`),
  KEY `fk_app_status` (`status`),
  KEY `fk_giver_id` (`giverID`),
  KEY `ix_status` (`status`),
  KEY `ix_takerid_giverid` (`takerID`,`giverID`),
  CONSTRAINT `fk_app_status` FOREIGN KEY (`status`) REFERENCES `AppointmentStatus` (`appointmentStatus`),
  CONSTRAINT `fk_giver_id` FOREIGN KEY (`giverID`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_taker_id` FOREIGN KEY (`takerID`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `AppointmentStatus` (
  `appointmentStatus` int(11) NOT NULL,
  `statusString` varchar(30) NOT NULL,
  PRIMARY KEY (`appointmentStatus`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `UserInfo` (
  `userID` int(11) unsigned NOT NULL,
  `infoID` int(11) NOT NULL AUTO_INCREMENT,
  `infoKey` varchar(50) NOT NULL,
  `infoValue` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`infoID`),
  KEY `fk_userid` (`userID`),
  CONSTRAINT `fk_userid` FOREIGN KEY (`userID`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `password` char(60) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  KEY `ix_username_password` (`username`,`password`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

