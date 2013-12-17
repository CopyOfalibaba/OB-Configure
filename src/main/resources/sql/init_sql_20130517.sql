DROP TABLE IF EXISTS `config_data_history`;
create table config_data_history (
    `data_id`                  varchar(256),
    `version`                  varchar(128),
    `operator`                 varchar(128),
    `create_time`              datetime,
    `data_content`             varchar(511) NOT NULL DEFAULT '',
    `jar_path`                 varchar(511) NOT NULL DEFAULT '',
    `is_process`               tinyint,
    `white_list`               varchar(1023),
    `percentage`               int, 
    `operate`                  varchar(32),
  	`cluster_address_03`       varchar(511) DEFAULT '',
 	`master_cluster`           varchar(511) DEFAULT '',
  	`cluster_flow_percent`     varchar(511) DEFAULT '',
    primary key(`data_id`, `create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;

DROP TABLE IF EXISTS `config_data`;
CREATE TABLE `config_data` (
  `data_id`                  varchar(255) not null primary key,
  `username`     	         varchar(511) NOT NULL DEFAULT '',
  `password`     	         varchar(511) NOT NULL DEFAULT '',
  `data_content`             varchar(511) NOT NULL DEFAULT '',
  `cluster_address_03`       varchar(511) DEFAULT '',
  `master_cluster`           varchar(511) DEFAULT '',
  `cluster_flow_percent`     varchar(511) DEFAULT '',
  `jar_path`                 varchar(511) NOT NULL DEFAULT '',
  `is_process`               tinyint,
  `is_monitor`               tinyint,
  `current_version`          varchar(511),
  `white_list`               varchar(1023),
  `ds_config`	             varchar(511),
  `percentage`               int, 
  `create_time`              datetime DEFAULT NULL,
  `modify_time`              datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=gbk;

DROP TABLE IF EXISTS `jar_repo`;
CREATE TABLE `jar_repo` (
  `jar_id`           int(4) primary key auto_increment,
  `jar_version`      varchar(256) not null unique,
  `jar_content`      longblob,
  `jar_name`         varchar(511),
  `create_time`      datetime,
  `checksum`         varchar(64)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;