DROP SCHEMA public CASCADE; 

CREATE SCHEMA public; 

CREATE TABLE unit( 
    unit_id SERIAL PRIMARY KEY,
    name VARCHAR (50) NOT NULL
); 

CREATE TABLE cloud_provider( 
    provider_id SERIAL PRIMARY KEY,
    name VARCHAR (255) NOT NULL,
    description VARCHAR (255)
); 

CREATE TABLE data_center( 
    data_center_id SERIAL PRIMARY KEY,
    name VARCHAR (255) NOT NULL,
    location VARCHAR (255),
    provider_id INT NOT NULL,
    FOREIGN KEY (provider_id) REFERENCES cloud_provider(provider_id)
); 

CREATE TABLE cloud_pool( 
    cloud_pool_id SERIAL PRIMARY KEY,
    name VARCHAR (255) NOT NULL,
    total_memory DECIMAL (10, 2),
    total_memory_unit_id INT,
    total_cpu INT,
    total_disk_capacity DECIMAL (10, 2),
    total_disk_unit_id INT,
    data_center_id INT,
    FOREIGN KEY (data_center_id) REFERENCES data_center(data_center_id),
    FOREIGN KEY (total_memory_unit_id) REFERENCES unit(unit_id),
    FOREIGN KEY (total_disk_unit_id) REFERENCES unit(unit_id)
); 

CREATE TABLE users( 
    user_id SERIAL PRIMARY KEY,
    username VARCHAR (255) NOT NULL,
    email VARCHAR (255) NOT NULL
); 

CREATE TABLE login_users( 
    login_user_id SERIAL PRIMARY KEY,
    username VARCHAR (255) NOT NULL,
    password_hash VARCHAR (255) NOT NULL,
    email VARCHAR (255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 

CREATE TABLE operating_system( 
    os_id SERIAL PRIMARY KEY,
    name VARCHAR (255) NOT NULL,
    version VARCHAR (255)
); 

CREATE TABLE storage_device( 
    storage_device_id SERIAL PRIMARY KEY,
    name VARCHAR (255) NOT NULL,
    total_capacity DECIMAL (10, 2),
    total_capacity_unit_id INT,
    cloud_pool_id INT,
    FOREIGN KEY (total_capacity_unit_id) REFERENCES unit(unit_id),
    FOREIGN KEY (cloud_pool_id) REFERENCES cloud_pool(cloud_pool_id)
); 

CREATE TABLE virtual_machine( 
    vm_id SERIAL PRIMARY KEY,
    name VARCHAR (255) NOT NULL,
    instance_type VARCHAR (255),
    status VARCHAR (50),
    memory DECIMAL (10, 2),
    memory_unit_id INT,
    cpu INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cloud_pool_id INT,
    os_id INT,
    custom_os VARCHAR (255),
    user_id INT,
    FOREIGN KEY (cloud_pool_id) REFERENCES cloud_pool(cloud_pool_id),
    FOREIGN KEY (os_id) REFERENCES operating_system(os_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (memory_unit_id) REFERENCES unit(unit_id)
); 

-- トリガー関数の作成
CREATE 
OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ 
BEGIN 
    NEW.updated_at = NOW(); 
    RETURN NEW; 
END; 
$$ LANGUAGE 'plpgsql'; 

-- トリガーの作成
CREATE TRIGGER update_virtual_machine_updated_at 
BEFORE UPDATE ON virtual_machine 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column(); 

CREATE TABLE disk( 
    disk_id SERIAL PRIMARY KEY,
    storage_device_id INT,
    size DECIMAL (10, 2),
    unit_id INT,
    disk_name VARCHAR (255) NOT NULL,
    FOREIGN KEY (storage_device_id) REFERENCES storage_device(storage_device_id),
    FOREIGN KEY (unit_id) REFERENCES unit(unit_id)
); 

CREATE TABLE partition ( 
    partition_id SERIAL PRIMARY KEY,
    disk_id INT,
    size DECIMAL (10, 2),
    unit_id INT,
    filesystem VARCHAR (50),
    FOREIGN KEY (disk_id) REFERENCES disk(disk_id),
    FOREIGN KEY (unit_id) REFERENCES unit(unit_id)
); 

CREATE TABLE ip_address( 
    ip_address_id SERIAL PRIMARY KEY,
    vm_id INT,
    vlan VARCHAR (50),
    ipv4 VARCHAR (15),
    ipv6 VARCHAR (39),
    FOREIGN KEY (vm_id) REFERENCES virtual_machine(vm_id)
); 

CREATE TABLE system( 
    system_id SERIAL PRIMARY KEY,
    name VARCHAR (255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 

-- トリガーの作成（systemテーブル用）
CREATE TRIGGER update_system_updated_at 
BEFORE UPDATE ON system 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column(); 

CREATE TABLE system_virtual_machine( 
    system_id INT,
    vm_id INT,
    PRIMARY KEY (system_id, vm_id),
    FOREIGN KEY (system_id) REFERENCES system(system_id),
    FOREIGN KEY (vm_id) REFERENCES virtual_machine(vm_id)
); 
