use datos_empleados;

-- Tabla de empleados
create table empleados(
	cuil varchar(15) primary key not null,
	nombre_completo VARCHAR(50) not null,
	tipo_contratacion int unsigned not null 
);

-- Tabla de sueldos
create table sueldos(
    sueldo_id int unsigned primary key auto_increment,
    empleados varchar(15),  -- Cambié el tipo de dato a varchar(15)
    total_remunerativo varchar(15) not null,
    total_no_remunerativo varchar(15) not null,
    tipo_aporte_adicional varchar(3) not null,
    monto_aporte_adicional varchar(3) not null,
    -- FK de la tabla empleados
    foreign key (empleados) references empleados(cuil)
);


-- Tabla de licencias 
create table licencias(
	licencias_id int unsigned auto_increment primary key,
	tipo_licencia tinyint not null,
	dias_licencia tinyint not null,
	licencias varchar(15),
-- 	FK de la tabla empleados
	foreign key (licencias) references empleados(cuil)
);

-- Tabla de cargos
create table cargos(
	cargo_id int unsigned auto_increment primary key,
	asignaciones varchar(15) not null,
	categoria varchar(50) not null,
	clase_nivel varchar(50),
	cargo_funcion varchar(50),
-- 	FK de la tabla empledos
	foreign key (asignaciones) references empleados(cuil)
);

-- Tabla de contrataciones
create table contrataciones(
	contratacion_id int unsigned auto_increment primary key,
	contrato varchar(15) not null,
	mes tinyint not null,
	año int not null,
	dias_trabajados tinyint not null,
-- 	FK de la tabla de empleados
	foreign key (contrato) references empleados(cuil)
);

-- Creacion de los indices para optimizar las consultas
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
    e.tipo_contratacion as regimen,
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
    c2.contratacion_id AS contratato,
    c2.mes AS contratacion_mes,
    c2.año AS contratacion_año,
    c2.dias_trabajados AS contratacion_dias
FROM empleados e
LEFT JOIN sueldos s ON e.cuil = s.empleados
LEFT JOIN licencias l ON e.cuil = l.licencias
LEFT JOIN cargos c ON e.cuil = c.asignaciones
left join contrataciones c2 on e.cuil  = c2.contrato 
