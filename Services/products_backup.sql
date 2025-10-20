--
-- PostgreSQL database dump
--

\restrict z5kvCpGnZD7fCQtLz9WJlip2AyFqQgOKKPLpSCblhgixzEOXeIgKhkX2eJHRtbw

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: products_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO products_user;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: products_user
--

COMMENT ON SCHEMA public IS '';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Product; Type: TABLE; Schema: public; Owner: products_user
--

CREATE TABLE public."Product" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    "categoryId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdBy" text DEFAULT 'unknown'::text NOT NULL
);


ALTER TABLE public."Product" OWNER TO products_user;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: products_user
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO products_user;

--
-- Name: products; Type: TABLE; Schema: public; Owner: products_user
--

CREATE TABLE public.products (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    name text NOT NULL,
    description text,
    price numeric(12,2) NOT NULL,
    created_by text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    category_id text,
    active boolean DEFAULT true NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    CONSTRAINT products_price_check CHECK ((price >= (0)::numeric)),
    CONSTRAINT products_stock_check CHECK ((stock >= 0))
);


ALTER TABLE public.products OWNER TO products_user;

--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: products_user
--

COPY public."Product" (id, name, description, price, "categoryId", "createdAt", "updatedAt", "createdBy") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: products_user
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
f5451e32-15be-4e53-b5e3-21a95bf8e629	18af92ae00cb8f79d01d06ac6a415d51789f4fedc77cb8aae43eb2492e680400	2025-10-19 20:01:40.615196+00	20250930033046_init	\N	\N	2025-10-19 20:01:40.592707+00	1
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: products_user
--

COPY public.products (id, name, description, price, created_by, created_at, updated_at, category_id, active, stock) FROM stdin;
ef5c71f1-410d-4257-a100-610ee973e260	Caf� org�nico	Caf� 100% natural de la Sierra Nevada	25000.00	unknown	2025-10-19 20:03:56.161981+00	2025-10-19 20:03:56.161981+00	\N	t	0
fb08e1c9-6dc8-4dc9-b96d-9368b58a2ba9	Caf� org�nico	Caf� 100% natural de la Sierra Nevada	25000.00	super@admin.com	2025-10-19 20:18:48.489407+00	2025-10-19 20:18:48.489407+00	\N	t	0
fe1883dc-c0a3-4559-8cd3-1fe73df6fae2	Caf� org�nico	Caf� 100% natural de la Sierra Nevada	25000.00	super@admin.com	2025-10-19 20:59:53.161466+00	2025-10-19 20:59:53.161466+00	\N	t	0
33022a93-2739-4678-80d8-a0af94eaacba	Caf� org�nico	Caf� 100% natural de la Sierra Nevada	25000.00	super@admin.com	2025-10-19 21:02:27.577574+00	2025-10-19 21:02:27.577574+00	\N	t	0
0c807695-95f2-464e-ae91-1fdfd613fec5	Caf� org�nico	Caf� 100% natural de la Sierra Nevada	25000.00	super@admin.com	2025-10-20 02:29:19.673425+00	2025-10-20 02:29:19.673425+00	\N	t	0
e3d3a9e6-be43-4281-9847-8977712af84b	Caf� org�nico	Caf� 100% natural de la Sierra Nevada	25000.00	super@admin.com	2025-10-20 02:31:55.319115+00	2025-10-20 02:31:55.319115+00	\N	t	0
e96d2ed5-ab35-48ee-a10c-e1a810ad7ee4	Caf� org�nico	Caf� 100% natural de la Sierra Nevada	25000.00	super@admin.com	2025-10-20 02:36:32.051789+00	2025-10-20 02:36:32.051789+00	\N	t	0
ce06cec9-a1a7-45ab-ab27-5710e0f99872	Caf� org�nico	Caf� 100% natural de la Sierra Nevada	25000.00	super@admin.com	2025-10-20 02:41:37.220874+00	2025-10-20 02:41:37.220874+00	\N	t	0
1e935b68-ef97-4149-9afa-10c38ab86e99	Test API-Ready	\N	19.99	admin-uuid	2025-10-20 03:19:01.70308+00	2025-10-20 03:19:01.70308+00	\N	t	0
72c15c9b-d763-4183-a73d-93450e2ff0e8	T� negro	Infusi�n oscura	15.50	super@admin.com	2025-10-20 03:19:29.464125+00	2025-10-20 03:19:29.464125+00	\N	t	0
37ee2dd2-4d6f-4cc3-901f-6614d7f4848f	T� verde	Infusi�n	12.50	super@admin.com	2025-10-20 03:27:23.598998+00	2025-10-20 03:27:23.598998+00	\N	t	0
ae7e8b62-df9c-445a-aff3-c03c6d62afb8	T� verde (cat)	Infusi�n	12.50	super@admin.com	2025-10-20 03:36:47.341351+00	2025-10-20 04:12:11.293633+00	\N	t	100
946d7f98-6a50-4dbf-9e4e-a08fa759a507	T� listo	Con stock	12.50	super@admin.com	2025-10-20 04:15:55.633526+00	2025-10-20 04:15:55.633526+00	\N	t	0
d2834625-9c08-4e8f-98d5-9910024456f2	Producto activo OK	ok	10.50	super@admin.com	2025-10-20 05:22:57.083647+00	2025-10-20 05:22:57.083647+00	\N	t	0
\.


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: products_user
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: products_user
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: products_user
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: idx_products_category_id; Type: INDEX; Schema: public; Owner: products_user
--

CREATE INDEX idx_products_category_id ON public.products USING btree (category_id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: products_user
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict z5kvCpGnZD7fCQtLz9WJlip2AyFqQgOKKPLpSCblhgixzEOXeIgKhkX2eJHRtbw

