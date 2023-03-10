-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le :  lun. 09 jan. 2023 à 05:46
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

-- --------------------------------------------------------

--
-- Structure de la table `contrat_maintenance_detail`
--

CREATE TABLE `contrat_maintenance_detail` (
  `id` int(11) NOT NULL,
  `contrat_maintenance_id` int(11) NOT NULL,
  `equipement_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `contrat_garantie`
--
ALTER TABLE `contrat_garantie`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `contrat_garantie_detail`
--
ALTER TABLE `contrat_garantie_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `contrat_garantie_gab`
--
ALTER TABLE `contrat_garantie_gab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `contrat_maintenance`
--
ALTER TABLE `contrat_maintenance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `contrat_maintenance_detail`
--
ALTER TABLE `contrat_maintenance_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `contrat_maintenance_gab`
--
ALTER TABLE `contrat_maintenance_gab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `equipement`
--
ALTER TABLE `equipement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `famille`
--
ALTER TABLE `famille`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `livraison`
--
ALTER TABLE `livraison`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `province`
--
ALTER TABLE `province`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `redevance_gab`
--
ALTER TABLE `redevance_gab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
