-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: sites
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tb_network`
--

DROP TABLE IF EXISTS `tb_network`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_network` (
  `id` int NOT NULL AUTO_INCREMENT,
  `network_name` varchar(255) DEFAULT NULL,
  `network_equip` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_network`
--

LOCK TABLES `tb_network` WRITE;
/*!40000 ALTER TABLE `tb_network` DISABLE KEYS */;
INSERT INTO `tb_network` VALUES (1,'Normal Site','2G & 3G'),(3,'Adjacent Site','2G & 3G'),(4,'Edge Data Center','2G & 3G');
/*!40000 ALTER TABLE `tb_network` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_power`
--

DROP TABLE IF EXISTS `tb_power`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_power` (
  `id` int NOT NULL AUTO_INCREMENT,
  `main_power` varchar(255) DEFAULT NULL,
  `backup_power` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_power`
--

LOCK TABLES `tb_power` WRITE;
/*!40000 ALTER TABLE `tb_power` DISABLE KEYS */;
INSERT INTO `tb_power` VALUES (1,'Kplc','Solar'),(2,'Solar power','Diesel Gen');
/*!40000 ALTER TABLE `tb_power` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_region`
--

DROP TABLE IF EXISTS `tb_region`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_region` (
  `id` int NOT NULL AUTO_INCREMENT,
  `region_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_region`
--

LOCK TABLES `tb_region` WRITE;
/*!40000 ALTER TABLE `tb_region` DISABLE KEYS */;
INSERT INTO `tb_region` VALUES (1,'Mombasa'),(2,'Kwale'),(3,'Kilifi'),(4,'Tana River'),(5,'Lamu'),(6,'Taita/Taveta'),(7,'Garissa'),(8,'Wajir'),(9,'Mandera'),(10,'Marsabit'),(11,'Isiolo'),(12,'Meru'),(13,'Tharaka-Nithi'),(14,'Embu'),(15,'Kitui'),(16,'Machakos'),(17,'Makueni'),(18,'Nyandarua'),(19,'Nyeri'),(20,'Kirinyaga'),(21,'Murang\'a'),(22,'Kiambu'),(23,'Turkana'),(24,'West Pokot'),(25,'Samburu'),(26,'Trans Nzoia'),(27,'Uasin Gishu'),(28,'Elgeyo/Marakwet'),(29,'Nandi'),(30,'Baringo'),(31,'Laikipia'),(32,'Nakuru'),(33,'Narok'),(34,'Kajiado'),(35,'Kericho'),(36,'Bomet'),(37,'Kakamega'),(38,'Vihiga'),(39,'Bungoma'),(40,'Busia'),(41,'Siaya'),(42,'Kisumu'),(43,'Homa Bay'),(44,'Migori'),(45,'Kisii'),(46,'Nyamira'),(47,'Nairobi City');
/*!40000 ALTER TABLE `tb_region` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_site`
--

DROP TABLE IF EXISTS `tb_site`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_site` (
  `id` int NOT NULL AUTO_INCREMENT,
  `site_id` varchar(50) NOT NULL,
  `asset_description` varchar(255) DEFAULT NULL,
  `description` text,
  `town_id` int DEFAULT NULL,
  `region_id` int DEFAULT NULL,
  `network_id` int DEFAULT NULL,
  `power_id` int DEFAULT NULL,
  `latitude` varchar(255) DEFAULT NULL,
  `longitude` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `plot_size` double DEFAULT NULL,
  `bua` double DEFAULT NULL,
  `fair_value` int DEFAULT NULL,
  `land` int DEFAULT NULL,
  `improvements` int DEFAULT NULL,
  `total_value` int DEFAULT NULL,
  `enroachment_status` varchar(255) DEFAULT NULL,
  `critical_to_enterprise` varchar(255) DEFAULT NULL,
  `status_description` varchar(255) DEFAULT NULL,
  `govt_equp` varchar(255) DEFAULT NULL,
  `tkl_shop` varchar(255) DEFAULT NULL,
  `atc_tower` varchar(255) DEFAULT NULL,
  `charged_to_bank` varchar(255) DEFAULT NULL,
  `on_sfc_deed` varchar(255) DEFAULT NULL,
  `requested_by_sfc` varchar(255) DEFAULT NULL,
  `on_atc_court` varchar(255) DEFAULT NULL,
  `on_atc_deed` varchar(255) DEFAULT NULL,
  `wholesale` varchar(255) DEFAULT NULL,
  `ownership_docs` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `property_id` (`asset_description`),
  KEY `town_id` (`town_id`),
  KEY `region_id` (`region_id`),
  KEY `network_id` (`network_id`),
  KEY `power_id` (`power_id`),
  CONSTRAINT `tb_site_ibfk_2` FOREIGN KEY (`town_id`) REFERENCES `tb_town` (`id`),
  CONSTRAINT `tb_site_ibfk_3` FOREIGN KEY (`region_id`) REFERENCES `tb_region` (`id`),
  CONSTRAINT `tb_site_ibfk_5` FOREIGN KEY (`network_id`) REFERENCES `tb_network` (`id`),
  CONSTRAINT `tb_site_ibfk_6` FOREIGN KEY (`power_id`) REFERENCES `tb_power` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_site`
--

LOCK TABLES `tb_site` WRITE;
/*!40000 ALTER TABLE `tb_site` DISABLE KEYS */;
INSERT INTO `tb_site` VALUES (1,'101MS','1','Telephone Exchange',1,3,1,1,'0°13N','37°55E',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,'101MS','1','Telephone Exchange',68,3,1,1,'0°13N','37°55E',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(5,'122KS','1','Telephone Exchange',2,1,1,1,'0°13N','37°55E',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(8,'12FS','1','Telephone Exchange',1,1,1,2,'0°19N','37°55E',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(9,'1S','1','Telephone Exchange',44,2,1,2,'0°19N','37°55E',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(10,'028NB','2','Telephone Exchange',47,2,4,2,'0°19N','37°55E',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `tb_site` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_town`
--

DROP TABLE IF EXISTS `tb_town`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_town` (
  `id` int NOT NULL AUTO_INCREMENT,
  `town_name` varchar(255) DEFAULT NULL,
  `region_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `region_id` (`region_id`),
  CONSTRAINT `tb_town_ibfk_1` FOREIGN KEY (`region_id`) REFERENCES `tb_region` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=113 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_town`
--

LOCK TABLES `tb_town` WRITE;
/*!40000 ALTER TABLE `tb_town` DISABLE KEYS */;
INSERT INTO `tb_town` VALUES (1,'Bamburi',1),(2,'Belewa',1),(3,'Bwagamoyo',1),(4,'Frere Town',1),(5,'Golo',1),(6,'Jomvu',1),(7,'Jumba la Mtwana',1),(8,'Jumvu',1),(9,'Kashani',1),(10,'Kazoli',1),(11,'Kisaoni',1),(12,'Kisauni',1),(13,'Kwa Bechombo',1),(14,'Kwa Jomvu',1),(15,'Likoni',1),(16,'Mirarani',1),(17,'Mirihini',1),(18,'Miritini',1),(19,'Mitsolokanani',1),(20,'Mitsolokani',1),(21,'Mkunguni',1),(22,'Mombaaso',1),(23,'Mombasa',1),(24,'Mombassa',1),(25,'Moya',1),(26,'Mto Panga',1),(27,'Mtongwe',1),(28,'Mvita',1),(29,'Mwachirunge',1),(30,'Mwachirunje ya Pwani',1),(31,'Mwakirunge',1),(32,'Mwakirunge ya Pwani',1),(33,'Mwandoni',1),(34,'Nyali',1),(35,'Old Mombasa',1),(36,'Old Town',1),(37,'Pendeza',1),(38,'Shanzu',1),(39,'Shimanzi',1),(40,'Shimo la Tewa',1),(41,'Shámanzi',1),(42,'Utange',1),(43,'Vifanjoni',1),(44,'Bazo',2),(45,'Bwaga Cheti',2),(46,'Chingwede',2),(47,'Dololo',2),(48,'Dundani',2),(49,'Dzirive',2),(50,'Golini',2),(51,'Jambole',2),(52,'Jego',2),(53,'Kwale',2),(54,'Livundoni',2),(55,'Lungalunga',2),(56,'Msambweni',2),(57,'Ufumbani',2),(58,'Ukunda',2),(59,'Vikinduni',2),(60,'Wasin',2),(61,'Majoreni',2),(62,'Tezo',3),(63,'Sokoni',3),(64,'Kibarani',3),(65,'Dabaso',3),(66,'Matsangoni',3),(67,'Watamu',3),(68,'Mnarani',3),(69,'Junju',3),(70,'Mwarakaya',3),(71,'Shimo la Tewa',3),(72,'Chasimba',3),(73,'Mtepeni',3),(74,'Mariakani',3),(75,'Kayafungo',3),(76,'Kaloleni',3),(77,'Mwana Mwinga',3),(78,'Mwawesa',3),(79,'Ruruma',3),(80,'Kambe-Ribe',3),(81,'Rabai/Kisurutuni',3),(82,'Ganze',3),(83,'Bamba',3),(84,'Jaribuni',3),(85,'Sokoke',3),(86,'Jilore',3),(87,'Kakuyuni',3),(88,'Ganda',3),(89,'Malindi Town',3),(90,'Shella',3),(91,'Maarafa',3),(92,'Magarini',3),(93,'Gongoni',3),(94,'Adu',3),(95,'Garashi',3),(96,'Sabaki',3),(97,'Kipini East',4),(98,'Garsen South',4),(99,'Kipini West',4),(100,'Garsen Central',4),(101,'Garsen West',4),(102,'Garsen North',4),(103,'Kinakomba',4),(104,'Mikinduni',4),(105,'Chewani',4),(106,'Wayu',4),(107,'Chewele',4),(108,'Mtepeni',4),(109,'Hirimani',4),(110,'Bangale',4),(111,'Sala',4),(112,'Madogo',4);
/*!40000 ALTER TABLE `tb_town` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-13 13:12:49
