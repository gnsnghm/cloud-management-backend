--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

-- Started on 2024-07-08 23:38:41

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 18725)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 4983 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- TOC entry 240 (class 1255 OID 18850)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 18755)
-- Name: cloud_pool; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cloud_pool (
    cloud_pool_id integer NOT NULL,
    name character varying(255) NOT NULL,
    total_memory numeric(10,2),
    total_memory_unit_id integer,
    total_cpu integer,
    total_disk_capacity numeric(10,2),
    total_disk_unit_id integer,
    data_center_id integer
);


ALTER TABLE public.cloud_pool OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 18754)
-- Name: cloud_pool_cloud_pool_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cloud_pool_cloud_pool_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cloud_pool_cloud_pool_id_seq OWNER TO postgres;

--
-- TOC entry 4985 (class 0 OID 0)
-- Dependencies: 221
-- Name: cloud_pool_cloud_pool_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cloud_pool_cloud_pool_id_seq OWNED BY public.cloud_pool.cloud_pool_id;


--
-- TOC entry 218 (class 1259 OID 18734)
-- Name: cloud_provider; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cloud_provider (
    provider_id integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255)
);


ALTER TABLE public.cloud_provider OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 18733)
-- Name: cloud_provider_provider_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cloud_provider_provider_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cloud_provider_provider_id_seq OWNER TO postgres;

--
-- TOC entry 4986 (class 0 OID 0)
-- Dependencies: 217
-- Name: cloud_provider_provider_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cloud_provider_provider_id_seq OWNED BY public.cloud_provider.provider_id;


--
-- TOC entry 220 (class 1259 OID 18741)
-- Name: data_center; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.data_center (
    data_center_id integer NOT NULL,
    name character varying(255) NOT NULL,
    location character varying(255),
    provider_id integer NOT NULL
);


ALTER TABLE public.data_center OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 18740)
-- Name: data_center_data_center_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.data_center_data_center_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.data_center_data_center_id_seq OWNER TO postgres;

--
-- TOC entry 4987 (class 0 OID 0)
-- Dependencies: 219
-- Name: data_center_data_center_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.data_center_data_center_id_seq OWNED BY public.data_center.data_center_id;


--
-- TOC entry 234 (class 1259 OID 18853)
-- Name: disk; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.disk (
    disk_id integer NOT NULL,
    storage_device_id integer,
    size numeric(10,2),
    unit_id integer,
    disk_name character varying(255) NOT NULL
);


ALTER TABLE public.disk OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 18852)
-- Name: disk_disk_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.disk_disk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.disk_disk_id_seq OWNER TO postgres;

--
-- TOC entry 4988 (class 0 OID 0)
-- Dependencies: 233
-- Name: disk_disk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.disk_disk_id_seq OWNED BY public.disk.disk_id;


--
-- TOC entry 236 (class 1259 OID 18887)
-- Name: ip_address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ip_address (
    ip_address_id integer NOT NULL,
    vm_id integer,
    vlan character varying(50),
    ipv4 character varying(15),
    ipv6 character varying(39)
);


ALTER TABLE public.ip_address OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 18886)
-- Name: ip_address_ip_address_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ip_address_ip_address_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ip_address_ip_address_id_seq OWNER TO postgres;

--
-- TOC entry 4989 (class 0 OID 0)
-- Dependencies: 235
-- Name: ip_address_ip_address_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ip_address_ip_address_id_seq OWNED BY public.ip_address.ip_address_id;


--
-- TOC entry 226 (class 1259 OID 18786)
-- Name: login_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.login_users (
    login_user_id integer NOT NULL,
    username character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.login_users OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 18785)
-- Name: login_users_login_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.login_users_login_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.login_users_login_user_id_seq OWNER TO postgres;

--
-- TOC entry 4990 (class 0 OID 0)
-- Dependencies: 225
-- Name: login_users_login_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.login_users_login_user_id_seq OWNED BY public.login_users.login_user_id;


--
-- TOC entry 228 (class 1259 OID 18796)
-- Name: operating_system; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.operating_system (
    os_id integer NOT NULL,
    name character varying(255) NOT NULL,
    version character varying(255)
);


ALTER TABLE public.operating_system OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 18795)
-- Name: operating_system_os_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.operating_system_os_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.operating_system_os_id_seq OWNER TO postgres;

--
-- TOC entry 4991 (class 0 OID 0)
-- Dependencies: 227
-- Name: operating_system_os_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.operating_system_os_id_seq OWNED BY public.operating_system.os_id;


--
-- TOC entry 230 (class 1259 OID 18803)
-- Name: storage_device; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.storage_device (
    storage_device_id integer NOT NULL,
    name character varying(255) NOT NULL,
    total_capacity numeric(10,2),
    total_capacity_unit_id integer,
    cloud_pool_id integer
);


ALTER TABLE public.storage_device OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 18802)
-- Name: storage_device_storage_device_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.storage_device_storage_device_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.storage_device_storage_device_id_seq OWNER TO postgres;

--
-- TOC entry 4992 (class 0 OID 0)
-- Dependencies: 229
-- Name: storage_device_storage_device_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.storage_device_storage_device_id_seq OWNED BY public.storage_device.storage_device_id;


--
-- TOC entry 238 (class 1259 OID 18899)
-- Name: system; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.system (
    system_id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.system OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 18898)
-- Name: system_system_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.system_system_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.system_system_id_seq OWNER TO postgres;

--
-- TOC entry 4993 (class 0 OID 0)
-- Dependencies: 237
-- Name: system_system_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.system_system_id_seq OWNED BY public.system.system_id;


--
-- TOC entry 239 (class 1259 OID 18910)
-- Name: system_virtual_machine; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.system_virtual_machine (
    system_id integer NOT NULL,
    vm_id integer NOT NULL
);


ALTER TABLE public.system_virtual_machine OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 18727)
-- Name: unit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.unit (
    unit_id integer NOT NULL,
    name character varying(50) NOT NULL,
    multiplier numeric(10,2)
);


ALTER TABLE public.unit OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 18726)
-- Name: unit_unit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.unit_unit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.unit_unit_id_seq OWNER TO postgres;

--
-- TOC entry 4994 (class 0 OID 0)
-- Dependencies: 215
-- Name: unit_unit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.unit_unit_id_seq OWNED BY public.unit.unit_id;


--
-- TOC entry 224 (class 1259 OID 18777)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 18776)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 4995 (class 0 OID 0)
-- Dependencies: 223
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 232 (class 1259 OID 18820)
-- Name: virtual_machine; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.virtual_machine (
    vm_id integer NOT NULL,
    name character varying(255) NOT NULL,
    instance_type character varying(255),
    status character varying(50),
    memory_unit_id integer,
    cpu integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cloud_pool_id integer,
    os_id integer,
    custom_os character varying(255),
    user_id integer,
    disk_id integer,
    disk_size numeric(10,2),
    disk_unit_id integer,
    memory_size numeric(10,2),
    ipv4 character varying(255),
    ipv6 character varying(255),
    vlan integer
);


ALTER TABLE public.virtual_machine OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 18819)
-- Name: virtual_machine_vm_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.virtual_machine_vm_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.virtual_machine_vm_id_seq OWNER TO postgres;

--
-- TOC entry 4996 (class 0 OID 0)
-- Dependencies: 231
-- Name: virtual_machine_vm_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.virtual_machine_vm_id_seq OWNED BY public.virtual_machine.vm_id;


--
-- TOC entry 4751 (class 2604 OID 18758)
-- Name: cloud_pool cloud_pool_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cloud_pool ALTER COLUMN cloud_pool_id SET DEFAULT nextval('public.cloud_pool_cloud_pool_id_seq'::regclass);


--
-- TOC entry 4749 (class 2604 OID 18737)
-- Name: cloud_provider provider_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cloud_provider ALTER COLUMN provider_id SET DEFAULT nextval('public.cloud_provider_provider_id_seq'::regclass);


--
-- TOC entry 4750 (class 2604 OID 18744)
-- Name: data_center data_center_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.data_center ALTER COLUMN data_center_id SET DEFAULT nextval('public.data_center_data_center_id_seq'::regclass);


--
-- TOC entry 4760 (class 2604 OID 18856)
-- Name: disk disk_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disk ALTER COLUMN disk_id SET DEFAULT nextval('public.disk_disk_id_seq'::regclass);


--
-- TOC entry 4761 (class 2604 OID 18890)
-- Name: ip_address ip_address_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ip_address ALTER COLUMN ip_address_id SET DEFAULT nextval('public.ip_address_ip_address_id_seq'::regclass);


--
-- TOC entry 4753 (class 2604 OID 18789)
-- Name: login_users login_user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_users ALTER COLUMN login_user_id SET DEFAULT nextval('public.login_users_login_user_id_seq'::regclass);


--
-- TOC entry 4755 (class 2604 OID 18799)
-- Name: operating_system os_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.operating_system ALTER COLUMN os_id SET DEFAULT nextval('public.operating_system_os_id_seq'::regclass);


--
-- TOC entry 4756 (class 2604 OID 18806)
-- Name: storage_device storage_device_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.storage_device ALTER COLUMN storage_device_id SET DEFAULT nextval('public.storage_device_storage_device_id_seq'::regclass);


--
-- TOC entry 4762 (class 2604 OID 18902)
-- Name: system system_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system ALTER COLUMN system_id SET DEFAULT nextval('public.system_system_id_seq'::regclass);


--
-- TOC entry 4748 (class 2604 OID 18730)
-- Name: unit unit_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit ALTER COLUMN unit_id SET DEFAULT nextval('public.unit_unit_id_seq'::regclass);


--
-- TOC entry 4752 (class 2604 OID 18780)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 4757 (class 2604 OID 18823)
-- Name: virtual_machine vm_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.virtual_machine ALTER COLUMN vm_id SET DEFAULT nextval('public.virtual_machine_vm_id_seq'::regclass);


--
-- TOC entry 4960 (class 0 OID 18755)
-- Dependencies: 222
-- Data for Name: cloud_pool; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cloud_pool (cloud_pool_id, name, total_memory, total_memory_unit_id, total_cpu, total_disk_capacity, total_disk_unit_id, data_center_id) FROM stdin;
3	ProLiant DL360 Gen9	2.00	4	2	128.00	4	7
1	ProLiant DL360 Gen9	2.00	4	2	128.00	4	1
\.


--
-- TOC entry 4956 (class 0 OID 18734)
-- Dependencies: 218
-- Data for Name: cloud_provider; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cloud_provider (provider_id, name, description) FROM stdin;
1	AWS	Amazon
2	GCP	Google
5	Azure	Microsoft
3	on premise	自社
\.


--
-- TOC entry 4958 (class 0 OID 18741)
-- Dependencies: 220
-- Data for Name: data_center; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.data_center (data_center_id, name, location, provider_id) FROM stdin;
5	米国	バージニア	1
1	大阪	大阪製作所	3
7	名古屋	名古屋製作所	3
8	東京	東京製作所	3
\.


--
-- TOC entry 4972 (class 0 OID 18853)
-- Dependencies: 234
-- Data for Name: disk; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.disk (disk_id, storage_device_id, size, unit_id, disk_name) FROM stdin;
1	9	1.00	4	WD_1
20	13	1.00	4	HGST_1
\.


--
-- TOC entry 4974 (class 0 OID 18887)
-- Dependencies: 236
-- Data for Name: ip_address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ip_address (ip_address_id, vm_id, vlan, ipv4, ipv6) FROM stdin;
\.


--
-- TOC entry 4964 (class 0 OID 18786)
-- Dependencies: 226
-- Data for Name: login_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.login_users (login_user_id, username, password_hash, email, created_at) FROM stdin;
1	sushi	$2a$10$538S444fApTQEMz/WEOgYu4cGgSDhq59s1o18WtFTQrLVnzi1EsAS	a@b.c	2024-06-25 23:53:04.409484
3	すし	$2a$10$Wuh5FRq3TGA6JMSgpfzCoO83/Yf6DhwXZKHcobTYio4oxpmFAScAy	xx@yy.zz	2024-06-30 21:09:37.886682
5	すし2	$2a$10$GYgnAakGbGADUbU98uflXOH0oav/oas2y6IEXPBpwxmsStf0G.d5S	x@y.z	2024-06-30 21:11:10.912322
6	shoyu	$2a$10$8EITTVYIR/EY4StywOBrr.Hlj.6CFrbqXJqTMD3z6EzIkXK1wc6Xe	shoyu@example.com	2024-07-08 22:59:59.962777
\.


--
-- TOC entry 4966 (class 0 OID 18796)
-- Dependencies: 228
-- Data for Name: operating_system; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.operating_system (os_id, name, version) FROM stdin;
1	Ubuntu	22.04
3	Ubuntu	20.04
\.


--
-- TOC entry 4968 (class 0 OID 18803)
-- Dependencies: 230
-- Data for Name: storage_device; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.storage_device (storage_device_id, name, total_capacity, total_capacity_unit_id, cloud_pool_id) FROM stdin;
13	HGST	5.00	4	3
9	WD Storages	1.00	4	1
11	WD Storages2	3.00	4	1
\.


--
-- TOC entry 4976 (class 0 OID 18899)
-- Dependencies: 238
-- Data for Name: system; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.system (system_id, name, description, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4977 (class 0 OID 18910)
-- Dependencies: 239
-- Data for Name: system_virtual_machine; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.system_virtual_machine (system_id, vm_id) FROM stdin;
\.


--
-- TOC entry 4954 (class 0 OID 18727)
-- Dependencies: 216
-- Data for Name: unit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.unit (unit_id, name, multiplier) FROM stdin;
1	KB	3.00
2	MB	6.00
3	GB	9.00
4	TB	12.00
9	B	1.00
\.


--
-- TOC entry 4962 (class 0 OID 18777)
-- Dependencies: 224
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, username, email) FROM stdin;
11	田中	tnk@example.com
12	鈴木	szk@example.com
13	佐藤	sato@example.com
\.


--
-- TOC entry 4970 (class 0 OID 18820)
-- Dependencies: 232
-- Data for Name: virtual_machine; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.virtual_machine (vm_id, name, instance_type, status, memory_unit_id, cpu, created_at, updated_at, cloud_pool_id, os_id, custom_os, user_id, disk_id, disk_size, disk_unit_id, memory_size, ipv4, ipv6, vlan) FROM stdin;
4	zabbix	\N	\N	3	\N	2024-07-08 00:44:22.638789	2024-07-08 23:37:06.729045	1	1	\N	12	20	100.00	3	16.00	192.168.100.100		101
\.


--
-- TOC entry 4997 (class 0 OID 0)
-- Dependencies: 221
-- Name: cloud_pool_cloud_pool_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cloud_pool_cloud_pool_id_seq', 3, true);


--
-- TOC entry 4998 (class 0 OID 0)
-- Dependencies: 217
-- Name: cloud_provider_provider_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cloud_provider_provider_id_seq', 8, true);


--
-- TOC entry 4999 (class 0 OID 0)
-- Dependencies: 219
-- Name: data_center_data_center_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.data_center_data_center_id_seq', 8, true);


--
-- TOC entry 5000 (class 0 OID 0)
-- Dependencies: 233
-- Name: disk_disk_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.disk_disk_id_seq', 20, true);


--
-- TOC entry 5001 (class 0 OID 0)
-- Dependencies: 235
-- Name: ip_address_ip_address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ip_address_ip_address_id_seq', 1, false);


--
-- TOC entry 5002 (class 0 OID 0)
-- Dependencies: 225
-- Name: login_users_login_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.login_users_login_user_id_seq', 6, true);


--
-- TOC entry 5003 (class 0 OID 0)
-- Dependencies: 227
-- Name: operating_system_os_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.operating_system_os_id_seq', 3, true);


--
-- TOC entry 5004 (class 0 OID 0)
-- Dependencies: 229
-- Name: storage_device_storage_device_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.storage_device_storage_device_id_seq', 13, true);


--
-- TOC entry 5005 (class 0 OID 0)
-- Dependencies: 237
-- Name: system_system_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.system_system_id_seq', 1, false);


--
-- TOC entry 5006 (class 0 OID 0)
-- Dependencies: 215
-- Name: unit_unit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.unit_unit_id_seq', 9, true);


--
-- TOC entry 5007 (class 0 OID 0)
-- Dependencies: 223
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 13, true);


--
-- TOC entry 5008 (class 0 OID 0)
-- Dependencies: 231
-- Name: virtual_machine_vm_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.virtual_machine_vm_id_seq', 4, true);


--
-- TOC entry 4772 (class 2606 OID 18760)
-- Name: cloud_pool cloud_pool_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cloud_pool
    ADD CONSTRAINT cloud_pool_pkey PRIMARY KEY (cloud_pool_id);


--
-- TOC entry 4768 (class 2606 OID 18739)
-- Name: cloud_provider cloud_provider_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cloud_provider
    ADD CONSTRAINT cloud_provider_pkey PRIMARY KEY (provider_id);


--
-- TOC entry 4770 (class 2606 OID 18748)
-- Name: data_center data_center_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.data_center
    ADD CONSTRAINT data_center_pkey PRIMARY KEY (data_center_id);


--
-- TOC entry 4784 (class 2606 OID 18858)
-- Name: disk disk_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disk
    ADD CONSTRAINT disk_pkey PRIMARY KEY (disk_id);


--
-- TOC entry 4786 (class 2606 OID 18892)
-- Name: ip_address ip_address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ip_address
    ADD CONSTRAINT ip_address_pkey PRIMARY KEY (ip_address_id);


--
-- TOC entry 4776 (class 2606 OID 18794)
-- Name: login_users login_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_users
    ADD CONSTRAINT login_users_pkey PRIMARY KEY (login_user_id);


--
-- TOC entry 4778 (class 2606 OID 18801)
-- Name: operating_system operating_system_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.operating_system
    ADD CONSTRAINT operating_system_pkey PRIMARY KEY (os_id);


--
-- TOC entry 4780 (class 2606 OID 18808)
-- Name: storage_device storage_device_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.storage_device
    ADD CONSTRAINT storage_device_pkey PRIMARY KEY (storage_device_id);


--
-- TOC entry 4788 (class 2606 OID 18908)
-- Name: system system_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system
    ADD CONSTRAINT system_pkey PRIMARY KEY (system_id);


--
-- TOC entry 4790 (class 2606 OID 18914)
-- Name: system_virtual_machine system_virtual_machine_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_virtual_machine
    ADD CONSTRAINT system_virtual_machine_pkey PRIMARY KEY (system_id, vm_id);


--
-- TOC entry 4766 (class 2606 OID 18732)
-- Name: unit unit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit
    ADD CONSTRAINT unit_pkey PRIMARY KEY (unit_id);


--
-- TOC entry 4774 (class 2606 OID 18784)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4782 (class 2606 OID 18829)
-- Name: virtual_machine virtual_machine_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.virtual_machine
    ADD CONSTRAINT virtual_machine_pkey PRIMARY KEY (vm_id);


--
-- TOC entry 4809 (class 2620 OID 18909)
-- Name: system update_system_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_system_updated_at BEFORE UPDATE ON public.system FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4808 (class 2620 OID 18851)
-- Name: virtual_machine update_virtual_machine_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_virtual_machine_updated_at BEFORE UPDATE ON public.virtual_machine FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4792 (class 2606 OID 18761)
-- Name: cloud_pool cloud_pool_data_center_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cloud_pool
    ADD CONSTRAINT cloud_pool_data_center_id_fkey FOREIGN KEY (data_center_id) REFERENCES public.data_center(data_center_id);


--
-- TOC entry 4793 (class 2606 OID 18771)
-- Name: cloud_pool cloud_pool_total_disk_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cloud_pool
    ADD CONSTRAINT cloud_pool_total_disk_unit_id_fkey FOREIGN KEY (total_disk_unit_id) REFERENCES public.unit(unit_id);


--
-- TOC entry 4794 (class 2606 OID 18766)
-- Name: cloud_pool cloud_pool_total_memory_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cloud_pool
    ADD CONSTRAINT cloud_pool_total_memory_unit_id_fkey FOREIGN KEY (total_memory_unit_id) REFERENCES public.unit(unit_id);


--
-- TOC entry 4791 (class 2606 OID 18749)
-- Name: data_center data_center_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.data_center
    ADD CONSTRAINT data_center_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.cloud_provider(provider_id);


--
-- TOC entry 4803 (class 2606 OID 18859)
-- Name: disk disk_storage_device_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disk
    ADD CONSTRAINT disk_storage_device_id_fkey FOREIGN KEY (storage_device_id) REFERENCES public.storage_device(storage_device_id);


--
-- TOC entry 4804 (class 2606 OID 18864)
-- Name: disk disk_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disk
    ADD CONSTRAINT disk_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.unit(unit_id);


--
-- TOC entry 4805 (class 2606 OID 18893)
-- Name: ip_address ip_address_vm_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ip_address
    ADD CONSTRAINT ip_address_vm_id_fkey FOREIGN KEY (vm_id) REFERENCES public.virtual_machine(vm_id);


--
-- TOC entry 4795 (class 2606 OID 18814)
-- Name: storage_device storage_device_cloud_pool_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.storage_device
    ADD CONSTRAINT storage_device_cloud_pool_id_fkey FOREIGN KEY (cloud_pool_id) REFERENCES public.cloud_pool(cloud_pool_id);


--
-- TOC entry 4796 (class 2606 OID 18809)
-- Name: storage_device storage_device_total_capacity_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.storage_device
    ADD CONSTRAINT storage_device_total_capacity_unit_id_fkey FOREIGN KEY (total_capacity_unit_id) REFERENCES public.unit(unit_id);


--
-- TOC entry 4806 (class 2606 OID 18915)
-- Name: system_virtual_machine system_virtual_machine_system_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_virtual_machine
    ADD CONSTRAINT system_virtual_machine_system_id_fkey FOREIGN KEY (system_id) REFERENCES public.system(system_id);


--
-- TOC entry 4807 (class 2606 OID 18920)
-- Name: system_virtual_machine system_virtual_machine_vm_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_virtual_machine
    ADD CONSTRAINT system_virtual_machine_vm_id_fkey FOREIGN KEY (vm_id) REFERENCES public.virtual_machine(vm_id);


--
-- TOC entry 4797 (class 2606 OID 18830)
-- Name: virtual_machine virtual_machine_cloud_pool_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.virtual_machine
    ADD CONSTRAINT virtual_machine_cloud_pool_id_fkey FOREIGN KEY (cloud_pool_id) REFERENCES public.cloud_pool(cloud_pool_id);


--
-- TOC entry 4798 (class 2606 OID 18930)
-- Name: virtual_machine virtual_machine_disk_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.virtual_machine
    ADD CONSTRAINT virtual_machine_disk_id_fkey FOREIGN KEY (disk_id) REFERENCES public.disk(disk_id);


--
-- TOC entry 4799 (class 2606 OID 18935)
-- Name: virtual_machine virtual_machine_disk_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.virtual_machine
    ADD CONSTRAINT virtual_machine_disk_unit_id_fkey FOREIGN KEY (disk_unit_id) REFERENCES public.unit(unit_id);


--
-- TOC entry 4800 (class 2606 OID 18845)
-- Name: virtual_machine virtual_machine_memory_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.virtual_machine
    ADD CONSTRAINT virtual_machine_memory_unit_id_fkey FOREIGN KEY (memory_unit_id) REFERENCES public.unit(unit_id);


--
-- TOC entry 4801 (class 2606 OID 18835)
-- Name: virtual_machine virtual_machine_os_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.virtual_machine
    ADD CONSTRAINT virtual_machine_os_id_fkey FOREIGN KEY (os_id) REFERENCES public.operating_system(os_id);


--
-- TOC entry 4802 (class 2606 OID 18840)
-- Name: virtual_machine virtual_machine_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.virtual_machine
    ADD CONSTRAINT virtual_machine_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 4984 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2024-07-08 23:38:42

--
-- PostgreSQL database dump complete
--

