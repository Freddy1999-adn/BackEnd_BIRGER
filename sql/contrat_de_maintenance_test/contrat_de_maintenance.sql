-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le :  lun. 09 jan. 2023 à 07:54
-- Version du serveur :  10.4.8-MariaDB
-- Version de PHP :  7.3.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `contrat_de_maintenance`
--

-- --------------------------------------------------------

--
-- Structure de la table `client`
--

CREATE TABLE `client` (
  `id` int(11) NOT NULL,
  `nom_client` varchar(100) NOT NULL,
  `adresse` varchar(255) NOT NULL,
  `email` varchar(50) DEFAULT ' ',
  `tel` varchar(10) DEFAULT NULL,
  `ville_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `client`
--

INSERT INTO `client` (`id`, `nom_client`, `adresse`, `email`, `tel`, `ville_id`) VALUES
(1, 'BNI', 'Adresse BNI', '', '', 1),
(2, 'BNI', 'Adresse BNI', '', '', 2),
(3, 'BNI', 'Adresse BNI', '', '', 27),
(4, 'BNI', 'Adresse BNI', '', '', 23),
(5, 'BNI', 'Adresse BNI', '', '', 40),
(6, 'BOA', 'Adresse BOA', '', '', 38),
(7, 'BOA', 'Adresse BOA', '', '', 2),
(8, 'BOA', 'Adresse BOA', '', '', 13),
(9, 'BOA', 'Adresse BOA', '', '', 4),
(10, 'Rakoto', '67 ha', 'Rakoto@gmail.com', '0325896582', 1),
(11, 'BMOI', 'Adresse BMOI', '', '', 7),
(12, 'BMOI', 'Adresse BMOI', '', '', 5),
(13, 'BFV', 'Adresse BFV', '', '', 33);

-- --------------------------------------------------------

--
-- Structure de la table `contrat_garantie`
--

CREATE TABLE `contrat_garantie` (
  `id` int(11) NOT NULL,
  `num_contrat` varchar(20) NOT NULL,
  `observation` varchar(255) DEFAULT NULL,
  `livraison_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `contrat_garantie`
--

INSERT INTO `contrat_garantie` (`id`, `num_contrat`, `observation`, `livraison_id`) VALUES
(1, '256965', '', 5);

-- --------------------------------------------------------

--
-- Structure de la table `contrat_garantie_detail`
--

CREATE TABLE `contrat_garantie_detail` (
  `id` int(11) NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `statut` varchar(20) NOT NULL,
  `is_alarmed_before` tinyint(1) NOT NULL DEFAULT 0,
  `date_alarm_before` date DEFAULT NULL,
  `equipement_id` int(11) NOT NULL,
  `contrat_garantie_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `contrat_garantie_detail`
--

INSERT INTO `contrat_garantie_detail` (`id`, `date_debut`, `date_fin`, `statut`, `is_alarmed_before`, `date_alarm_before`, `equipement_id`, `contrat_garantie_id`) VALUES
(1, '2023-01-01', '2023-12-31', 'Valide', 0, '2023-11-16', 1, 1),
(2, '2023-01-01', '2023-12-31', 'Valide', 0, '2023-11-16', 8, 1);

-- --------------------------------------------------------

--
-- Structure de la table `contrat_garantie_gab`
--

CREATE TABLE `contrat_garantie_gab` (
  `id` int(11) NOT NULL,
  `date_installation` date NOT NULL,
  `date_fin` date NOT NULL,
  `statut` varchar(20) NOT NULL,
  `site_installation` varchar(255) NOT NULL,
  `observation` varchar(255) DEFAULT NULL,
  `is_alarmed_before` tinyint(1) NOT NULL DEFAULT 0,
  `date_alarm_before` date DEFAULT NULL,
  `equipement_id` int(11) NOT NULL,
  `livraison_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `contrat_garantie_gab`
--

INSERT INTO `contrat_garantie_gab` (`id`, `date_installation`, `date_fin`, `statut`, `site_installation`, `observation`, `is_alarmed_before`, `date_alarm_before`, `equipement_id`, `livraison_id`) VALUES
(1, '2023-01-01', '2023-03-31', 'Valide', 'Analakely 2em', 'Contrat 24x7 par Lenovo', 0, '2023-02-14', 14, 1),
(2, '2022-02-15', '2022-05-14', 'Expiré', 'Analakely', NULL, 0, '2022-03-30', 14, 1),
(3, '2022-02-04', '2022-08-03', 'Expiré', 'Toliara ville 3em', NULL, 0, '2022-06-19', 19, 6),
(4, '2022-11-24', '2023-02-23', 'Valide', 'Ambalavao Rue ...', NULL, 0, '2023-01-09', 22, 7);

-- --------------------------------------------------------

--
-- Structure de la table `contrat_maintenance`
--

CREATE TABLE `contrat_maintenance` (
  `id` int(11) NOT NULL,
  `num_contrat` varchar(20) NOT NULL,
  `num_facture` varchar(20) DEFAULT NULL,
  `date_facture` date DEFAULT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `statut` varchar(25) NOT NULL,
  `redevance_totale` decimal(10,2) DEFAULT NULL,
  `observation` varchar(255) DEFAULT 'NULL',
  `is_alarmed_before` tinyint(1) NOT NULL DEFAULT 0,
  `date_alarm_before` date DEFAULT NULL,
  `date_proposition` date DEFAULT NULL,
  `client_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `contrat_maintenance`
--

INSERT INTO `contrat_maintenance` (`id`, `num_contrat`, `num_facture`, `date_facture`, `date_debut`, `date_fin`, `statut`, `redevance_totale`, `observation`, `is_alarmed_before`, `date_alarm_before`, `date_proposition`, `client_id`) VALUES
(1, '4159658', 'fact-9658', '2021-01-01', '2022-01-09', '2023-01-08', 'Expiré', '3500000.00', '', 0, '2022-11-24', '2020-12-17', 13),
(2, '4159658', 'fact-9658', '2021-01-01', '2023-01-09', '2024-01-08', 'Valide', '3500000.00', '', 0, '2023-11-24', '2020-12-17', 13),
(3, '4159658', 'fact-9658', '2021-01-01', '2021-01-09', '2022-01-08', 'Expiré', '3500000.00', '', 0, '2021-11-24', '2020-12-17', 13),
(4, '4526987', '', '2023-01-01', '2023-01-01', '2023-12-31', 'Valide', '1000000.00', 'SLA ...', 0, '2023-11-16', NULL, 7),
(5, '9658743', 'fact-698', NULL, '2022-02-24', '2023-02-23', 'Valide', '4000000.00', '', 0, '2023-01-09', NULL, 11);

-- --------------------------------------------------------

--
-- Structure de la table `contrat_maintenance_detail`
--

CREATE TABLE `contrat_maintenance_detail` (
  `id` int(11) NOT NULL,
  `contrat_maintenance_id` int(11) NOT NULL,
  `equipement_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `contrat_maintenance_detail`
--

INSERT INTO `contrat_maintenance_detail` (`id`, `contrat_maintenance_id`, `equipement_id`) VALUES
(1, 1, 13),
(2, 1, 12),
(3, 2, 13),
(4, 2, 12),
(5, 3, 13),
(6, 3, 12),
(9, 4, 8),
(10, 4, 5),
(11, 5, 10),
(12, 5, 2);

-- --------------------------------------------------------

--
-- Structure de la table `contrat_maintenance_gab`
--

CREATE TABLE `contrat_maintenance_gab` (
  `id` int(11) NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `site_installation` varchar(255) NOT NULL,
  `statut` varchar(20) NOT NULL,
  `observation` varchar(255) DEFAULT NULL,
  `date_proposition` date DEFAULT NULL,
  `redevance_totale` decimal(10,2) DEFAULT NULL,
  `annee_contrat` int(4) NOT NULL,
  `is_alarmed_before` tinyint(1) NOT NULL DEFAULT 0,
  `date_alarm_before` date DEFAULT NULL,
  `client_id` int(11) NOT NULL,
  `equipement_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `contrat_maintenance_gab`
--

INSERT INTO `contrat_maintenance_gab` (`id`, `date_debut`, `date_fin`, `site_installation`, `statut`, `observation`, `date_proposition`, `redevance_totale`, `annee_contrat`, `is_alarmed_before`, `date_alarm_before`, `client_id`, `equipement_id`) VALUES
(1, '2023-01-01', '2023-12-31', 'Toliara ville 3em', 'Valide', 'SLA : ...', '2022-07-17', '4200000.00', 2023, 0, '2023-11-16', 5, 19);

-- --------------------------------------------------------

--
-- Structure de la table `equipement`
--

CREATE TABLE `equipement` (
  `id` int(11) NOT NULL,
  `num_serie` varchar(20) NOT NULL,
  `marque` varchar(50) NOT NULL,
  `modele` varchar(50) NOT NULL,
  `fournisseur` varchar(100) DEFAULT NULL,
  `duree_garantie` int(11) DEFAULT NULL,
  `redevance_contrat` decimal(10,2) DEFAULT NULL,
  `is_locale` tinyint(1) NOT NULL DEFAULT 1,
  `livraison_id` int(11) DEFAULT NULL,
  `famille_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `equipement`
--

INSERT INTO `equipement` (`id`, `num_serie`, `marque`, `modele`, `fournisseur`, `duree_garantie`, `redevance_contrat`, `is_locale`, `livraison_id`, `famille_id`) VALUES
(1, 'CWQ 0927', 'CASHWORK', 'PRONOTE 120', NULL, 12, NULL, 1, 5, 1),
(2, 'CWQ 2365', 'CASHWORK', 'PRONOTE 120', NULL, 12, NULL, 1, NULL, 1),
(5, 'CWQ 1833', 'CASHWORK', 'PRONOTE 120', NULL, 12, '600000.00', 1, 3, 1),
(6, 'IP205D0141', 'ISNIPER', 'ST2000', NULL, 12, NULL, 1, NULL, 1),
(7, 'IP205D0108', 'ISNIPER', 'ST2000', NULL, 12, NULL, 1, NULL, 1),
(8, 'IP205D0114', 'ISNIPER', 'ST2000', NULL, 12, '400000.00', 1, 5, 1),
(9, ' ZB330 130205', 'HUIJIN', 'ZB330', NULL, 12, NULL, 1, 4, 2),
(10, 'ZB330 130207', 'HUIJIN', 'ZB330', NULL, 12, NULL, 1, NULL, 2),
(11, 'ZK400 0412317030081', 'HUIJIN', 'ZK400-BL', NULL, 12, NULL, 1, 4, 2),
(12, 'ZK400 0412317030086', 'HUIJIN', 'ZK400-BL', NULL, 12, NULL, 1, 4, 2),
(13, 'ZK400 0797', 'HUIJIN', 'ZK400-BL', NULL, NULL, NULL, 0, NULL, 2),
(14, '13-42898469', 'mar-gab-256', 'gab-mod-256', NULL, 3, NULL, 1, 1, 6),
(15, '13-49021589', 'gab-632', 'gab-mod-632', NULL, 3, NULL, 1, NULL, 6),
(16, '13-49034480', 'gab-895', 'gab-mod-895', NULL, 3, NULL, 1, 1, 6),
(18, '13-49034078', 'gab-639', 'gab-639', NULL, 6, NULL, 1, NULL, 6),
(19, '13-52965681', 'gab-962', 'gab-962', NULL, 6, NULL, 1, 6, 6),
(20, 'RT 520', 'Router', 'Router Tp Link ', NULL, NULL, NULL, 1, 5, 10),
(22, '13-52882522', 'gab-633', 'gab-mod-633', 'Zoom', 3, NULL, 1, 7, 6);

-- --------------------------------------------------------

--
-- Structure de la table `famille`
--

CREATE TABLE `famille` (
  `id` int(11) NOT NULL,
  `nom_famille` varchar(255) NOT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `service_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `famille`
--

INSERT INTO `famille` (`id`, `nom_famille`, `image_path`, `service_id`) VALUES
(1, 'COMPTEUSE DE BILLET', NULL, 2),
(2, 'MACHINE A FISCELER', NULL, 2),
(3, 'IMPRIMANTE', NULL, 2),
(4, 'SCANNER', NULL, 2),
(5, 'CAISSE ENREGISTREUSE', NULL, 2),
(6, 'GAB', NULL, 1),
(7, 'TPE', NULL, 1),
(8, 'VMWARE', NULL, 3),
(9, 'SERVEUR', NULL, 3),
(10, 'EQUIPEMENT RESEAU', NULL, 3);

-- --------------------------------------------------------

--
-- Structure de la table `livraison`
--

CREATE TABLE `livraison` (
  `id` int(11) NOT NULL,
  `date_livraison` date NOT NULL,
  `date_facture` date DEFAULT NULL,
  `num_bon_livraison` varchar(20) NOT NULL,
  `num_facture` varchar(20) DEFAULT NULL,
  `observation` varchar(255) DEFAULT NULL,
  `client_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `livraison`
--

INSERT INTO `livraison` (`id`, `date_livraison`, `date_facture`, `num_bon_livraison`, `num_facture`, `observation`, `client_id`) VALUES
(1, '2022-01-09', '2022-01-09', '2993505', 'fact-2993505', 'livraison ...', 1),
(3, '2023-01-09', '2023-01-09', '2993506', NULL, '', 3),
(4, '2024-01-09', NULL, '3003507', NULL, 'livraison des 3 équipements', 10),
(5, '2023-01-01', NULL, '4003501', NULL, NULL, 8),
(6, '2022-01-01', NULL, '5003506', NULL, '', 5),
(7, '2023-01-01', NULL, '1578596', NULL, NULL, 13);

-- --------------------------------------------------------

--
-- Structure de la table `province`
--

CREATE TABLE `province` (
  `id` int(11) NOT NULL,
  `nom_province` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `province`
--

INSERT INTO `province` (`id`, `nom_province`) VALUES
(1, 'Antananarivo'),
(2, 'Diego'),
(3, 'Fianarantsoa'),
(4, 'Mahajanga'),
(5, 'Toamasina'),
(6, 'Toliara');

-- --------------------------------------------------------

--
-- Structure de la table `redevance_gab`
--

CREATE TABLE `redevance_gab` (
  `id` int(11) NOT NULL,
  `type` varchar(2) NOT NULL,
  `num_facture` varchar(255) DEFAULT NULL,
  `date_facture` date DEFAULT NULL,
  `montant` decimal(10,2) NOT NULL,
  `isPaid` tinyint(1) NOT NULL DEFAULT 0,
  `contrat_maintenance_gab_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `redevance_gab`
--

INSERT INTO `redevance_gab` (`id`, `type`, `num_facture`, `date_facture`, `montant`, `isPaid`, `contrat_maintenance_gab_id`) VALUES
(1, 'Q1', NULL, NULL, '1050000.00', 1, 1),
(2, 'Q2', NULL, NULL, '1050000.00', 0, 1);

-- --------------------------------------------------------

--
-- Structure de la table `service`
--

CREATE TABLE `service` (
  `id` int(11) NOT NULL,
  `nom_service` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `service`
--

INSERT INTO `service` (`id`, `nom_service`, `description`) VALUES
(1, 'MONETIQUE', ''),
(2, 'BUREAUTIQUE', ''),
(3, 'SERVEUR et RESEAU', '');

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `pseudo` varchar(50) NOT NULL,
  `email` varchar(30) NOT NULL,
  `tel` varchar(10) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `is_envoie_rappel` tinyint(1) NOT NULL DEFAULT 0,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`id`, `nom`, `pseudo`, `email`, `tel`, `image_path`, `password`, `is_envoie_rappel`, `is_admin`) VALUES
(2, 'Franckie', 'Franckie Fk', 'franckieandriamalala@gmail.com', '0323025612', './storage/public/images/Liam.jpg', 'warol pass', 0, 1),
(50, 'sylvio', 'Jerry', 'nabo.sylvio@gmail.com', NULL, NULL, '$2a$10$4eV/v7gqOwWZ56oPGeBXGOg2fM/O/FrG2f1jIg.IH7O6YOT.f0BSS', 1, 0),
(53, 'Gloria', 'Gloria', 'gloria.r@birger.technology', NULL, NULL, '$2a$10$kZAt97ND3DhdTdUvo7hR9OkLRbH7BtUvKOne1YabZEm/dS7Cd1Die', 0, 0),
(54, 'JOSIA', 'JOSIA', 'josiarg@gmail.com', NULL, NULL, '$2a$10$fiRWfUzSdFDaifI4HdSaMelyxSz8Ej6StgSzM2Tr2hqe.hrYayAx2', 0, 1),
(55, 'www', 'www', 'www@gmail.com', NULL, NULL, '$2a$10$epVJCXeaBsdBJm.5QPOm5.Fb90JYgAJ1Sp71e91cZ0lBaCbiAJ0p6', 0, 1),
(56, 'ttt', 'ttt', 'ttt@gmaildd.com', '', './storage/public/images/zaza2.jpg', '$2a$10$H6vxOKxDBvJuzQ5iwHqkEOyD9AFk6pzla5bD/6qgTXeJhz1jFV0YG', 0, 1);

-- --------------------------------------------------------

--
-- Structure de la table `ville`
--

CREATE TABLE `ville` (
  `id` int(11) NOT NULL,
  `nom_ville` varchar(255) NOT NULL,
  `province_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `ville`
--

INSERT INTO `ville` (`id`, `nom_ville`, `province_id`) VALUES
(1, 'Antananarivo', 1),
(2, 'Antsirabe', 1),
(3, 'Ambatolampy', 1),
(4, 'Imerintsiatosika', 1),
(5, 'Toamasina', 5),
(6, 'Ambatondrazaka', 5),
(7, 'Fenerive-Est', 5),
(8, 'Maroantsetra', 5),
(9, 'Brickaville', 5),
(10, 'Amparafaravola', 5),
(11, 'Vatomandry', 5),
(12, 'Mahajanga', 4),
(13, 'Antsohihy', 4),
(14, 'Maintirano', 4),
(15, 'Mampikony', 4),
(16, 'Port-Bergé', 4),
(17, 'Maevatanana', 4),
(18, 'Marovoay', 4),
(19, 'Nosy be', 2),
(20, 'Diégo', 2),
(21, 'Antalaha', 2),
(22, 'Sambava', 2),
(23, 'Andapa', 2),
(24, 'Ambanja', 2),
(25, 'Ambilobe', 2),
(26, 'Vohémar', 2),
(27, 'Fianarantsoa', 3),
(28, 'Manakara', 3),
(29, 'Ambositra', 3),
(30, 'Farafangana', 3),
(31, 'Mananjary', 3),
(32, 'Ihosy', 3),
(33, 'Ambalavao', 3),
(34, 'Manakara', 3),
(35, 'Vangaindrano', 3),
(36, 'Vohipeno', 3),
(37, 'Toliara', 6),
(38, 'Fort-Dauphin', 6),
(39, 'Morondava', 6),
(40, 'Ambovombe', 6);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_client_ville` (`ville_id`);

--
-- Index pour la table `contrat_garantie`
--
ALTER TABLE `contrat_garantie`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `num_contrat` (`num_contrat`),
  ADD UNIQUE KEY `livraison_id` (`livraison_id`);

--
-- Index pour la table `contrat_garantie_detail`
--
ALTER TABLE `contrat_garantie_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_contrat_garantie_detail_contrat_garantie` (`contrat_garantie_id`),
  ADD KEY `fk_contrat_garantie_detail_equipement` (`equipement_id`);

--
-- Index pour la table `contrat_garantie_gab`
--
ALTER TABLE `contrat_garantie_gab`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_contrat_garantie_gab_equipement` (`equipement_id`),
  ADD KEY `fk_contrat_garantie_gab_livraison` (`livraison_id`);

--
-- Index pour la table `contrat_maintenance`
--
ALTER TABLE `contrat_maintenance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_contrat_maintenance_client` (`client_id`);

--
-- Index pour la table `contrat_maintenance_detail`
--
ALTER TABLE `contrat_maintenance_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_contrat_maintenance_detail_contrat_maintenance` (`contrat_maintenance_id`),
  ADD KEY `fk_contrat_maintenance_detail_equipement` (`equipement_id`);

--
-- Index pour la table `contrat_maintenance_gab`
--
ALTER TABLE `contrat_maintenance_gab`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_contrat_maintenance_gab_client` (`client_id`),
  ADD KEY `fk_contrat_maintenance_gab_equipement` (`equipement_id`);

--
-- Index pour la table `equipement`
--
ALTER TABLE `equipement`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `num_serie` (`num_serie`),
  ADD KEY `fk_equipement_famille` (`famille_id`),
  ADD KEY `fk_equipement_livraison` (`livraison_id`);

--
-- Index pour la table `famille`
--
ALTER TABLE `famille`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nom_famille` (`nom_famille`),
  ADD KEY `fk_famille_service` (`service_id`);

--
-- Index pour la table `livraison`
--
ALTER TABLE `livraison`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `num_bon_livraison` (`num_bon_livraison`),
  ADD UNIQUE KEY `num_facture` (`num_facture`),
  ADD KEY `fk_livraison_client` (`client_id`);

--
-- Index pour la table `province`
--
ALTER TABLE `province`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nom_province` (`nom_province`);

--
-- Index pour la table `redevance_gab`
--
ALTER TABLE `redevance_gab`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_redevance_gab_contrat_maintenance_gab` (`contrat_maintenance_gab_id`);

--
-- Index pour la table `service`
--
ALTER TABLE `service`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `ville`
--
ALTER TABLE `ville`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_ville_province` (`province_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `client`
--
ALTER TABLE `client`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `contrat_garantie`
--
ALTER TABLE `contrat_garantie`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `contrat_garantie_detail`
--
ALTER TABLE `contrat_garantie_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `contrat_garantie_gab`
--
ALTER TABLE `contrat_garantie_gab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `contrat_maintenance`
--
ALTER TABLE `contrat_maintenance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `contrat_maintenance_detail`
--
ALTER TABLE `contrat_maintenance_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `contrat_maintenance_gab`
--
ALTER TABLE `contrat_maintenance_gab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `equipement`
--
ALTER TABLE `equipement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT pour la table `famille`
--
ALTER TABLE `famille`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `livraison`
--
ALTER TABLE `livraison`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `province`
--
ALTER TABLE `province`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `redevance_gab`
--
ALTER TABLE `redevance_gab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `service`
--
ALTER TABLE `service`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT pour la table `ville`
--
ALTER TABLE `ville`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `client`
--
ALTER TABLE `client`
  ADD CONSTRAINT `fk_client_ville` FOREIGN KEY (`ville_id`) REFERENCES `ville` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `contrat_garantie`
--
ALTER TABLE `contrat_garantie`
  ADD CONSTRAINT `contrat_garantie_livraison` FOREIGN KEY (`livraison_id`) REFERENCES `livraison` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `contrat_garantie_detail`
--
ALTER TABLE `contrat_garantie_detail`
  ADD CONSTRAINT `fk_contrat_garantie_detail_contrat_garantie` FOREIGN KEY (`contrat_garantie_id`) REFERENCES `contrat_garantie` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_contrat_garantie_detail_equipement` FOREIGN KEY (`equipement_id`) REFERENCES `equipement` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `contrat_garantie_gab`
--
ALTER TABLE `contrat_garantie_gab`
  ADD CONSTRAINT `fk_contrat_garantie_gab_equipement` FOREIGN KEY (`equipement_id`) REFERENCES `equipement` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_contrat_garantie_gab_livraison` FOREIGN KEY (`livraison_id`) REFERENCES `livraison` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `contrat_maintenance`
--
ALTER TABLE `contrat_maintenance`
  ADD CONSTRAINT `fk_contrat_maintenance_client` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `contrat_maintenance_detail`
--
ALTER TABLE `contrat_maintenance_detail`
  ADD CONSTRAINT `fk_contrat_maintenance_detail_contrat_maintenance` FOREIGN KEY (`contrat_maintenance_id`) REFERENCES `contrat_maintenance` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_contrat_maintenance_detail_equipement` FOREIGN KEY (`equipement_id`) REFERENCES `equipement` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `contrat_maintenance_gab`
--
ALTER TABLE `contrat_maintenance_gab`
  ADD CONSTRAINT `fk_contrat_maintenance_gab_client` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_contrat_maintenance_gab_equipement` FOREIGN KEY (`equipement_id`) REFERENCES `equipement` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `equipement`
--
ALTER TABLE `equipement`
  ADD CONSTRAINT `fk_equipement_famille` FOREIGN KEY (`famille_id`) REFERENCES `famille` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_equipement_livraison` FOREIGN KEY (`livraison_id`) REFERENCES `livraison` (`id`) ON DELETE SET NULL ON UPDATE SET NULL;

--
-- Contraintes pour la table `famille`
--
ALTER TABLE `famille`
  ADD CONSTRAINT `fk_famille_service` FOREIGN KEY (`service_id`) REFERENCES `service` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `livraison`
--
ALTER TABLE `livraison`
  ADD CONSTRAINT `fk_livraison_client` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `redevance_gab`
--
ALTER TABLE `redevance_gab`
  ADD CONSTRAINT `fk_redevance_gab_contrat_maintenance_gab` FOREIGN KEY (`contrat_maintenance_gab_id`) REFERENCES `contrat_maintenance_gab` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `ville`
--
ALTER TABLE `ville`
  ADD CONSTRAINT `fk_ville_province` FOREIGN KEY (`province_id`) REFERENCES `province` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
