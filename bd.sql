use datos_empleados;

-- Tabla de empleados
create table empleados(
	cuil bigint primary key,
	nombre_completo VARCHAR(50) not null,
	regimenes tinyint not null,
-- 	FK del catalogo regimenes
	foreign key(regimenes) references regimen_contratacion(regimen_id)
);

-- Tabla de regimenes de contratacion
create table regimen_contratacion(
	regimen_id tinyint primary key,
	tipo_contratacion VARCHAR(50) not null
);

-- Tabla de suedos
create table sueldos(
	sueldo_id int unsigned primary key auto_increment,
	empleados bigint,
	total_remunerativo float(7,2) not null,
	total_no_remunerativo float(7,2) not null,
-- 	FK de la tabla empleados
	foreign key (empleados) references empleados(cuil)
);

-- Tabla de licencias 
create table licencias(
	licencias_id int unsigned auto_increment primary key,
	tipo_licencia tinyint not null,
	dias_licencia tinyint not null,
	licencias bigint,
-- 	FK de la tabla empleados
	foreign key (licencias) references empleados(cuil)
);

-- Tabla de cargos
create table cargos(
	cargo_id int unsigned auto_increment primary key,
	asignaciones bigint not null,
	categoria varchar(50) not null,
	clase_nivel varchar(15),
	cargo_funcion varchar(30),
-- 	FK de la tabla empledos
	foreign key (asignaciones) references empleados(cuil)
);

-- Tabla de contrataciones
create table contrataciones(
	contratacion_id int unsigned auto_increment primary key,
	contrato bigint not null,
	mes tinyint not null,
	año year not null,
	dias_trabajados tinyint not null,
-- 	FK de la tabla de empleados
	foreign key (contrato) references empleados(cuil)
);

-- Creacion de los indices para optimizar las consultas
create index idx_regimenes on empleados(regimenes);
create index idx_empleados_sueldos on sueldos(empleados);
create index idx_empleados_licencias on licencias(licencias);
create index idx_empleados_cargos on cargos(asignaciones);
create index idx_categoria_cargos on cargos(categoria);
create index idx_empleados_contrataciones on contrataciones(contrato);
create index idx_mes_contrataciones on contrataciones(mes);
create index idx_año_contrataciones on contrataciones(año);

-- Para la vista che 
SELECT 
    e.cuil AS empleado_cuil,
    e.nombre_completo AS empleado_nombre,
    rc.tipo_contratacion AS regimen_tipo,
    s.sueldo_id AS sueldo_id,
    s.total_remunerativo AS sueldo_remunerativo,
    s.total_no_remunerativo AS sueldo_no_remunerativo,
    l.licencias_id AS licencia_id,
    l.tipo_licencia AS licencia_tipo,
    l.dias_licencia AS licencia_dias,
    c.cargo_id AS cargo_id,
    c.categoria AS cargo_categoria,
    c.clase_nivel AS cargo_clase,
    c.cargo_funcion AS cargo_funcion,
    con.contratacion_id AS contratacion_id,
    con.mes AS contratacion_mes,
    con.año AS contratacion_año,
    con.dias_trabajados AS contratacion_dias
FROM empleados e
LEFT JOIN regimen_contratacion rc ON e.regimenes = rc.regimen_id
LEFT JOIN sueldos s ON e.cuil = s.empleados
LEFT JOIN licencias l ON e.cuil = l.licencias
LEFT JOIN cargos c ON e.cuil = c.asignaciones
LEFT JOIN contrataciones con ON e.cuil = con.contrato;