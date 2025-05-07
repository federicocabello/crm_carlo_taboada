SET SQL_SAFE_UPDATES = 0;
use suite_dotgital;
update contacts set date_entered = '2016-12-11 19:00:00' WHERE date_entered = '0016-12-11 19:00:00';
update contacts set date_entered = '2024-11-27 06:00:00' WHERE date_entered = '2048-11-27 06:00:00';
update contacts set date_entered = '2024-08-05 06:00:00' WHERE date_entered = '2048-08-05 06:00:00';
update contacts set date_entered = '2024-09-09 06:00:00' WHERE date_entered = '2048-09-09 06:00:00';
update contacts set date_entered = '2024-09-09 06:00:00' WHERE date_entered = '2047-09-09 06:00:00';
UPDATE contacts SET last_name = REPLACE(last_name, '(RECUPERADO)', '');
delete from contacts where first_name = 'EULALIO' and last_name = 'rodriguez' order by date_entered LIMIT 6;
delete from contacts where first_name = 'juan' and last_name = 'arreola' order by date_entered LIMIT 5;
delete from contacts where TRIM(first_name) = 'vicente' and TRIM(last_name) = 'arteaga' order by date_entered LIMIT 4;
delete from contacts where TRIM(first_name) = 'mariela' and TRIM(last_name) = 'luna tellez' order by date_entered DESC LIMIT 2;
delete from contacts where TRIM(first_name) = 'mariela luna' and TRIM(last_name) = 'tellez' order by date_entered DESC;
delete from contacts where first_name = 'mayra isabel' and last_name = 'casillas' order by date_entered DESC LIMIT 3;
delete from contacts where first_name = 'irineo' and last_name = 'sanchez de la rosa' order by date_entered DESC LIMIT 3;
delete from contacts where first_name = 'irineo sanchez' and last_name = 'de la rosa' order by date_entered DESC LIMIT 2;
delete from contacts where first_name = 'luis alberto' and last_name = 'salazar martinez' order by date_entered DESC LIMIT 3;
DELETE FROM contacts WHERE first_name = 'MARCEL' AND last_name = 'CRUZ' ORDER BY date_entered DESC LIMIT 3;
DELETE FROM contacts WHERE first_name = 'JESUS' AND last_name = 'GARZA' ORDER BY date_entered DESC LIMIT 3;
DELETE FROM contacts WHERE first_name = 'OSCAR' AND last_name = 'HERNANDEZ' ORDER BY date_entered DESC LIMIT 3;
DELETE FROM contacts WHERE first_name = 'RAFAEL' AND last_name = 'HERNANDEZ' ORDER BY date_entered DESC LIMIT 3;
DELETE FROM contacts WHERE first_name = 'OTONIEL' AND last_name = 'JAIMES' ORDER BY date_entered DESC LIMIT 3;
DELETE FROM contacts WHERE first_name = 'RAUL' AND last_name = 'LUNA' ORDER BY date_entered DESC LIMIT 3;
DELETE FROM contacts WHERE first_name = 'ANTONIO' AND last_name = 'MIRANDA' ORDER BY date_entered DESC LIMIT 3;
DELETE FROM contacts WHERE first_name = 'EFRAIN' AND last_name = 'ALARCON' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'ALEJANDRO' AND last_name = 'BELTRAN' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'JOEL' AND last_name = 'BELTRAN' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'DAYSI' AND last_name = 'CONSTANTINO' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'RIGOBERTO' AND last_name = 'HIDROGO' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'TEODULO' AND last_name = 'LOPEZ' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'JANNETT' AND last_name = 'LUNA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'GUADALUPE' AND last_name = 'MARTINEZ' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'ANGEL' AND last_name = 'MENDOZA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'JUAN' AND last_name = 'MORALES' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'AVELINO' AND last_name = 'RODRIGUEZ' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'ALFREDO' AND last_name = 'SALGADO' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'ASUNCION' AND last_name = 'SIFUENTES' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'ALDO' AND last_name = 'TOVAR' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'DANIEL' AND last_name = 'VAZQUEZ' ORDER BY date_entered DESC LIMIT 2;
delete from contacts where first_name = 'gualberto' and last_name = 'rico cruz' order by date_entered DESC LIMIT 3;
DELETE FROM contacts WHERE first_name = 'ANTONIA' AND last_name = 'ACOSTA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ERIK' AND last_name = 'ADRIAN HERRERA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'LUZ' AND last_name = 'ADRIANA MARES' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSE' AND last_name = 'LUIS AGUIERRE ROMO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'CARMINA' AND last_name = 'AGUILAR' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JESUS' AND last_name = 'ALATORRE' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'SONIA' AND last_name = 'ALCAZAR' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARTHA' AND last_name = 'ELENA ALVARADO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'DAIYA' AND last_name = 'ALONDRA ALVARADO MENDOZA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'FERNANDA' AND last_name = 'ALVAREZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSHUA' AND last_name = 'ALVAREZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ALONSO' AND last_name = 'ANTHONY RIOS' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARGARITO' AND last_name = 'ARREDONDO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'RAUDEL' AND last_name = 'AVILA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ELSA' AND last_name = 'BALLESTEROS' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'LUIS' AND last_name = 'BARRERA HERRERA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'RAMÓN' AND last_name = 'BARRIENTOS' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ANDREINA' AND last_name = 'MILAGROS BARROETA NUNEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'CRYSTAL' AND last_name = 'BAYONETA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'RAFAEL' AND last_name = 'MATA BECERRA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ALEJANDRO' AND last_name = 'BELTRAN RASCON' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'TABITA' AND last_name = 'BENAVIDEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JUSTIN' AND last_name = 'BOVAIRD' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JULIANA' AND last_name = 'CAMPOS' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JUAN' AND last_name = 'JOSE CARDOZA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JUAN' AND last_name = 'CARLOS JUAREZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JESUS' AND last_name = 'PINEDA CARRILLO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'STEPHANIE' AND last_name = 'CARRILLO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'YUVIA' AND last_name = 'JUDITH CARRILLO LOMAS' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ELIAS' AND last_name = 'CARRIZALES RODRIGUEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'CONSOLACION' AND last_name = 'CASTILLEJA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'AIDA' AND last_name = 'CASTILLO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ALFREDO' AND last_name = 'CASTRO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'OSCAR' AND last_name = 'ANTONIO GONE CASTRO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSE' AND last_name = 'CASTRO RODRIGUEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'INES' AND last_name = 'CASTRO ULLOA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'EDGAR' AND last_name = 'GARCIA CHAVEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'VERONICA' AND last_name = 'COOLEY' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'PEDRO' AND last_name = 'CORONADO MATA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSE' AND last_name = 'DAVILA REDIN' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIO' AND last_name = 'DE LA CRUZ SOTERO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'FRANCISCO' AND last_name = 'DE LA ROSA VELAZQUEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'SERGIO' AND last_name = 'DELGADO ACOSTA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'AUBREY' AND last_name = 'LEANN DIAZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSE' AND last_name = 'MANUEL DOROTEO ZUNIGA ROSAS' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'CHRISTIAN' AND last_name = 'ENRIQUEZ IBARRA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'STEPHANIE' AND last_name = 'ESCOBEDO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'LETICIA' AND last_name = 'ESPARZA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'RAMON' AND last_name = 'ESPARZA SAUCEDO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ISMAEL' AND last_name = 'ESQUEDA MARTINEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'RITA' AND last_name = 'ESTRADA LOPEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'EUGENIA RAZO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JULIAN' AND last_name = 'FIGUEROA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'SAMANTHA' AND last_name = 'MELISSA FIGUEROA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'GORETI' AND last_name = 'FLORES' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MAYELA' AND last_name = 'FONSECA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'YESENIA' AND last_name = 'GALLEGOS MARTINEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ANTONIA' AND last_name = 'GARCIA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'EFRAIN' AND last_name = 'GARCIA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'FERNANDO' AND last_name = 'GARCIA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'VICTOR' AND last_name = 'GARCIA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ARACELY' AND last_name = 'GARCIA MOTA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ENRIQUE' AND last_name = 'GARZA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'P?TRICIA' AND last_name = 'GARZA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'BLANCA' AND last_name = 'YESENIA GARZA RODRIGUEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'APRIL' AND last_name = 'GEORGES' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ALONDRA' AND last_name = 'GODINES' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'LAMBERTO' AND last_name = 'GOMEZ GONZALEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSEFINA' AND last_name = 'GONZALEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'YESENIA' AND last_name = 'GONZALEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'RAYMUNDO' AND last_name = 'GUERERO MACIAS' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'TIMOTEO' AND last_name = 'GUERRA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'DEL CARMEN GUERRERO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ELIEZER' AND last_name = 'HERBERT' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'GUILLERMO' AND last_name = 'MARMOLEJO HERNA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ARACELY' AND last_name = 'HERNANDEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'MANUELA HERNANDEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'EUNICE' AND last_name = 'HERNANDEZ-ADELEYE' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'CLARISSA' AND last_name = 'HERRERA GARCIA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'DE LA PAZ HOWEL' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'CRISTINA INTERIANO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'VICENTE' AND last_name = 'JAVIER VAZQUEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'DEICY JUANES' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ESTEBAN' AND last_name = 'BARRON JUAREZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'STEPHANIE' AND last_name = 'MARY LARES' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'SERGIO' AND last_name = 'J LEDESMA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ZAIRA' AND last_name = 'IVON LEON BENITEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'GLORIA' AND last_name = 'I LOPEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'KAREN' AND last_name = 'LOPEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ROBERTO' AND last_name = 'LOPEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ROSA' AND last_name = 'STELA LOPEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ROSARIO' AND last_name = 'LOPEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'SANDRA' AND last_name = 'LOPEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'DE LOS ANGELES SANCHEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'VANESSA' AND last_name = 'LUEVANOS VILLARREAL' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSE' AND last_name = 'LUIS RAMIREZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'LAURA' AND last_name = 'YESENIA LULE' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'NADIA' AND last_name = 'LUZ BITTER' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'ELENA MALDONADO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ALAN' AND last_name = 'OSVALDO MARTINEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ESTEBAN' AND last_name = 'MARTINEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'HERIBERTO' AND last_name = 'MARTINEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSE' AND last_name = 'LUIS MARTINEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'OSCAR' AND last_name = 'MARTINEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'SANDRA' AND last_name = 'MARTINEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'AGUSTIN' AND last_name = 'MASCORRO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ALEJANDRA' AND last_name = 'MATA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'EZEQUIEL' AND last_name = 'ISABEL MEDINA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARTIN' AND last_name = 'MEDINA BADILLO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MANUEL' AND last_name = 'DE JESUS MEDINA ESPINO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'FRANCISCO' AND last_name = 'JERONIMO MELENDEZ CORONADO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'OSCAR' AND last_name = 'MENDOZA GARCIA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'LUIS' AND last_name = 'ALBERTO MENDOZA HERNANDEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSE' AND last_name = 'FELIPE MONTALVO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ELISEO' AND last_name = 'MONTAÑEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'GENARO' AND last_name = 'MONTELONGO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JUAN' AND last_name = 'MONTES' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'FIDENCIO' AND last_name = 'MORALES' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MA' AND last_name = 'EVELIA MORENO HURTADO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'EMMANUEL' AND last_name = 'NEGRETE MANCIO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'JUANA OLVERA DE RAMIREZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'HECTOR' AND last_name = 'OMAR GONZALEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'CESAREO' AND last_name = 'ORDONEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ALFONSO' AND last_name = 'ORNELAS' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'STEPHANIE' AND last_name = 'PACHECO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JUANA' AND last_name = 'MARIA PALMILLAS' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'DIANA' AND last_name = 'PALOMO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'IRMA' AND last_name = 'ANGELICA PARGA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'CLAUDIA' AND last_name = 'PATRICIA VILLARREAL' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'CESAR' AND last_name = 'ALEJANDRO PENA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'REYNALDO' AND last_name = 'PEÑA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'RUTH' AND last_name = 'PEÑA DE FLORES' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'BESLIN' AND last_name = 'PERAZA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ANTONIO' AND last_name = 'PEREZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'RODRIGO' AND last_name = 'PEREZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'DANIEL' AND last_name = 'PEREZ III' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSE' AND last_name = 'PLATA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'KEILA' AND last_name = 'DEL VALLE PORTILLO MERCADO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ELIZABETH' AND last_name = 'QUEZADA ANZUA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'CLARA' AND last_name = 'RAMIREZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'A CANO RAMIREZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'DELFINO' AND last_name = 'RAMIREZ BANUELOS' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'LEONARDO' AND last_name = 'RANGEL' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'CLAUDIA' AND last_name = 'RAZO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'LETICIA' AND last_name = 'RESENDIZ GONZALEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ELIAZAR' AND last_name = 'REYES' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSE' AND last_name = 'MANUEL REYES' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSE' AND last_name = 'SERGIO REYNA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MIGUEL' AND last_name = 'ANGEL RICO TORRES' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'NORMA' AND last_name = 'RIOS' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'PABLO' AND last_name = 'RODRIGUEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ARTURO' AND last_name = 'RODRIGUEZ JR' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'SILVIA' AND last_name = 'RODRIGUEZ LILI' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JESUS' AND last_name = 'ROJAS' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'BARBARA' AND last_name = 'RONDON' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'KAREN' AND last_name = 'ROSALES' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ERICK' AND last_name = 'ROSARIO ALARCON' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'DAVID' AND last_name = 'I. RUIZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'YAHAIRA' AND last_name = 'SANCHEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JUAN' AND last_name = 'MANUEL SANCHEZ FAJARDO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'EDITH' AND last_name = 'SANCHEZ MARTINEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'GLAFIRO' AND last_name = 'SANCHEZ PEREZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'NOELIA' AND last_name = 'SANDOVAL ALVARADO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'EVAN' AND last_name = 'SANTILLAN' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'RAMON' AND last_name = 'SANTOS' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ALICIA' AND last_name = 'SHAGUN RAMOS' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'NILTON' AND last_name = 'ALEXANDER SIERRA RIVERA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JORGE' AND last_name = 'SIERRRA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ROSITA' AND last_name = 'SILVA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MA' AND last_name = 'DEL SOCORRO SALAZAR' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JUAN' AND last_name = 'TAPIA ALMARAZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARCEL' AND last_name = 'TEST' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSE' AND last_name = 'MARVIN TOBAR' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSE' AND last_name = 'TOCA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JORGE' AND last_name = 'TORRES SANCHEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'DEL CARMEN TREJO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'CESAR' AND last_name = 'GUZMAN VALDEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ROSARIO' AND last_name = 'VALERO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'CLAUDIA' AND last_name = 'GREGORIA VARGAS RUIZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'FRANCISCO' AND last_name = 'JAVIER VAZQUEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'LILIANA' AND last_name = 'ADELINE VAZQUEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'RICARDO' AND last_name = 'ADAME VAZQUEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'KATIA' AND last_name = 'ARACELY VILLANUEVA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'LAURA' AND last_name = 'YAQUELIN VILLAREAL' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MAGDALENO' AND last_name = 'GABRIEL VILLARREAL' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'FRANCISCO' AND last_name = 'WISLAR' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'SEBASTIAN' AND last_name = 'YANEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JESSICA' AND last_name = 'A ZAMORA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'LUISA ZAMORANO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JESUS' AND last_name = 'ZAVALA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'LEOPOLDO' AND last_name = 'ZUBIA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'FLOR' AND last_name = 'LETICIA ACOSTA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'MICHAEL' AND last_name = 'ADAM RIVERA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'JESUS' AND last_name = 'ALBERTO RESENDIZ' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'JESUS' AND last_name = 'CASTILLO VITE' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'CESAR' AND last_name = 'TOCA CHAVEZ' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'CRISTINA INTERIANO' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'ADRIANA' AND last_name = 'ELIZABETH MARMOLEJO' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'JONATHAN' AND last_name = 'ESQUIVEL RODRIGUEZ' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'ELENA FAVELA OLVERA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'ALFREDO' AND last_name = 'GARCIA CASTANEDA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'GONZALO' AND last_name = 'ALBERTO GARCIA CEBALLOS' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'JUAN' AND last_name = 'JAVIER GONZALEZ' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'ANTELMO' AND last_name = 'GONZALEZ CASTILLO' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'CESAR' AND last_name = 'GUZMAN VALDEZ' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'KEVIN' AND last_name = 'RENE HERNANDEZ MAJANO' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'ISABEL GARZA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'DOLORES' AND last_name = 'ALEJANDRO LEON CORTEZ' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'ORALIA' AND last_name = 'LOZOYA PUENTES' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'JOSE' AND last_name = 'MARVIN TOBAR' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'LISA' AND last_name = 'JANE MENDOZA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'EFRAIN' AND last_name = 'YANEZ MOYA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'JOSE' AND last_name = 'LUIS NIETO ROBLES' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'LUIS' AND last_name = 'ALBERTO RIVAS IBARRA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'JORGE' AND last_name = 'ROBERTO RODRIGUEZ' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'GUADALUPE' AND last_name = 'ABIGAIL SANCHEZ' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'DOLORES SINECIO LEON' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'FLORENTINO' AND last_name = 'TOCA AYALA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'J' AND last_name = 'MERCED ULISES DE LEON' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'MARCELO' AND last_name = 'VELAZQUEZ ESCALANTE' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'MA' AND last_name = 'ROSARIO VERA HURTADO' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'HERNAN' AND last_name = 'VILLEGAS CABRERA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'fermin' AND last_name = 'romero garcia' ORDER BY date_entered DESC LIMIT 3;
DELETE FROM contacts WHERE first_name = 'FLOR' AND last_name = 'LETICIA ACOSTA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'MICHAEL' AND last_name = 'ADAM RIVERA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'JESUS' AND last_name = 'ALBERTO RESENDIZ' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'JESUS' AND last_name = 'CASTILLO VITE' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'CESAR' AND last_name = 'TOCA CHAVEZ' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'CRISTINA INTERIANO' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'ADRIANA' AND last_name = 'ELIZABETH MARMOLEJO' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'JONATHAN' AND last_name = 'ESQUIVEL RODRIGUEZ' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'ELENA FAVELA OLVERA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'ALFREDO' AND last_name = 'GARCIA CASTANEDA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'GONZALO' AND last_name = 'ALBERTO GARCIA CEBALLOS' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'JUAN' AND last_name = 'JAVIER GONZALEZ' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'ANTELMO' AND last_name = 'GONZALEZ CASTILLO' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'CESAR' AND last_name = 'GUZMAN VALDEZ' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'KEVIN' AND last_name = 'RENE HERNANDEZ MAJANO' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'ISABEL GARZA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'DOLORES' AND last_name = 'ALEJANDRO LEON CORTEZ' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'ORALIA' AND last_name = 'LOZOYA PUENTES' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'JOSE' AND last_name = 'MARVIN TOBAR' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'LISA' AND last_name = 'JANE MENDOZA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'EFRAIN' AND last_name = 'YANEZ MOYA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'JOSE' AND last_name = 'LUIS NIETO ROBLES' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'LUIS' AND last_name = 'ALBERTO RIVAS IBARRA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'JORGE' AND last_name = 'ROBERTO RODRIGUEZ' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'GUADALUPE' AND last_name = 'ABIGAIL SANCHEZ' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'DOLORES SINECIO LEON' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'FLORENTINO' AND last_name = 'TOCA AYALA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'J' AND last_name = 'MERCED ULISES DE LEON' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'MARCELO' AND last_name = 'VELAZQUEZ ESCALANTE' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'MA' AND last_name = 'ROSARIO VERA HURTADO' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'HERNAN' AND last_name = 'VILLEGAS CABRERA' ORDER BY date_entered DESC LIMIT 2;
delete from contacts where first_name = 'fermin' and last_name = 'romero garcia' order by date_entered DESC LIMIT 3;
DELETE FROM contacts WHERE first_name = 'FLOR' AND last_name = 'LETICIA ACOSTA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'MICHAEL' AND last_name = 'ADAM RIVERA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'JESUS' AND last_name = 'ALBERTO RESENDIZ' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'JESUS' AND last_name = 'CASTILLO VITE' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'CESAR' AND last_name = 'TOCA CHAVEZ' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'CRISTINA INTERIANO' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'ADRIANA' AND last_name = 'ELIZABETH MARMOLEJO' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'JONATHAN' AND last_name = 'ESQUIVEL RODRIGUEZ' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'ELENA FAVELA OLVERA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'ALFREDO' AND last_name = 'GARCIA CASTANEDA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'GONZALO' AND last_name = 'ALBERTO GARCIA CEBALLOS' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'JUAN' AND last_name = 'JAVIER GONZALEZ' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'ANTELMO' AND last_name = 'GONZALEZ CASTILLO' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'CESAR' AND last_name = 'GUZMAN VALDEZ' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'KEVIN' AND last_name = 'RENE HERNANDEZ MAJANO' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'ISABEL GARZA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'DOLORES' AND last_name = 'ALEJANDRO LEON CORTEZ' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'ORALIA' AND last_name = 'LOZOYA PUENTES' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'JOSE' AND last_name = 'MARVIN TOBAR' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'LISA' AND last_name = 'JANE MENDOZA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'EFRAIN' AND last_name = 'YANEZ MOYA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'JOSE' AND last_name = 'LUIS NIETO ROBLES' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'LUIS' AND last_name = 'ALBERTO RIVAS IBARRA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'JORGE' AND last_name = 'ROBERTO RODRIGUEZ' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'GUADALUPE' AND last_name = 'ABIGAIL SANCHEZ' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'DOLORES SINECIO LEON' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'FLORENTINO' AND last_name = 'TOCA AYALA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'J' AND last_name = 'MERCED ULISES DE LEON' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'MARCELO' AND last_name = 'VELAZQUEZ ESCALANTE' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'MA' AND last_name = 'ROSARIO VERA HURTADO' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'HERNAN' AND last_name = 'VILLEGAS CABRERA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'MARIA ELENA' AND last_name = 'FAVELA OLVERA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'GONZALO ALBERTO' AND last_name = 'GARCIA CEBALLOS' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'KEVIN RENE' AND last_name = 'HERNANDEZ MAJANO' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'DOLORES ALEJANDRO' AND last_name = 'LEON CORTEZ' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'LISA JANE' AND last_name = 'MENDOZA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'JOSE LUIS' AND last_name = 'NIETO ROBLES' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'LUIS ALBERTO' AND last_name = 'RIVAS IBARRA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'JORGE ROBERTO' AND last_name = 'RODRIGUEZ' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'GUADALUPE ABIGAIL' AND last_name = 'SANCHEZ' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'MARIA DOLORES' AND last_name = 'SINECIO LEON' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'J MERCED ULISES' AND last_name = 'DE LEON' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE first_name = 'MA ROSARIO' AND last_name = 'VERA HURTADO' ORDER BY date_entered DESC LIMIT 2;
delete from contacts where first_name = 'j merced' and last_name = 'ulises de leon' order by date_entered DESC LIMIT 3;
DELETE FROM contacts WHERE first_name = 'ANTONIA' AND last_name = 'ACOSTA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ERIK' AND last_name = 'ADRIAN HERRERA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'LUZ' AND last_name = 'ADRIANA MARES' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSE' AND last_name = 'LUIS AGUIERRE ROMO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'CARMINA' AND last_name = 'AGUILAR' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JESUS' AND last_name = 'ALATORRE' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'SONIA' AND last_name = 'ALCAZAR' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARTHA' AND last_name = 'ELENA ALVARADO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'DAIYA' AND last_name = 'ALONDRA ALVARADO MENDOZA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'FERNANDA' AND last_name = 'ALVAREZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSHUA' AND last_name = 'ALVAREZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ALONSO' AND last_name = 'ANTHONY RIOS' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARGARITO' AND last_name = 'ARREDONDO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'RAUDEL' AND last_name = 'AVILA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ELSA' AND last_name = 'BALLESTEROS' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'LUIS' AND last_name = 'BARRERA HERRERA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'RAMÓN' AND last_name = 'BARRIENTOS' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ANDREINA' AND last_name = 'MILAGROS BARROETA NUNEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'CRYSTAL' AND last_name = 'BAYONETA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'RAFAEL' AND last_name = 'MATA BECERRA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ALEJANDRO' AND last_name = 'BELTRAN RASCON' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'TABITA' AND last_name = 'BENAVIDEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JUSTIN' AND last_name = 'BOVAIRD' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JULIANA' AND last_name = 'CAMPOS' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JUAN' AND last_name = 'JOSE CARDOZA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JUAN' AND last_name = 'CARLOS JUAREZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JESUS' AND last_name = 'PINEDA CARRILLO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'STEPHANIE' AND last_name = 'CARRILLO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'YUVIA' AND last_name = 'JUDITH CARRILLO LOMAS' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ELIAS' AND last_name = 'CARRIZALES RODRIGUEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'CONSOLACION' AND last_name = 'CASTILLEJA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'AIDA' AND last_name = 'CASTILLO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ALFREDO' AND last_name = 'CASTRO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'OSCAR' AND last_name = 'ANTONIO GONE CASTRO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSE' AND last_name = 'CASTRO RODRIGUEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'INES' AND last_name = 'CASTRO ULLOA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'EDGAR' AND last_name = 'GARCIA CHAVEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'VERONICA' AND last_name = 'COOLEY' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'PEDRO' AND last_name = 'CORONADO MATA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSE' AND last_name = 'DAVILA REDIN' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIO' AND last_name = 'DE LA CRUZ SOTERO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'FRANCISCO' AND last_name = 'DE LA ROSA VELAZQUEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'SERGIO' AND last_name = 'DELGADO ACOSTA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'AUBREY' AND last_name = 'LEANN DIAZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSE' AND last_name = 'MANUEL DOROTEO ZUNIGA ROSAS' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'CHRISTIAN' AND last_name = 'ENRIQUEZ IBARRA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'STEPHANIE' AND last_name = 'ESCOBEDO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'LETICIA' AND last_name = 'ESPARZA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'RAMON' AND last_name = 'ESPARZA SAUCEDO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ISMAEL' AND last_name = 'ESQUEDA MARTINEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'RITA' AND last_name = 'ESTRADA LOPEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'EUGENIA RAZO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JULIAN' AND last_name = 'FIGUEROA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'SAMANTHA' AND last_name = 'MELISSA FIGUEROA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'GORETI' AND last_name = 'FLORES' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MAYELA' AND last_name = 'FONSECA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'YESENIA' AND last_name = 'GALLEGOS MARTINEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ANTONIA' AND last_name = 'GARCIA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'EFRAIN' AND last_name = 'GARCIA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'FERNANDO' AND last_name = 'GARCIA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'VICTOR' AND last_name = 'GARCIA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ARACELY' AND last_name = 'GARCIA MOTA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ENRIQUE' AND last_name = 'GARZA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'PATRICIA' AND last_name = 'GARZA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'BLANCA' AND last_name = 'YESENIA GARZA RODRIGUEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'APRIL' AND last_name = 'GEORGES' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ALONDRA' AND last_name = 'GODINES' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'LAMBERTO' AND last_name = 'GOMEZ GONZALEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSEFINA' AND last_name = 'GONZALEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'YESENIA' AND last_name = 'GONZALEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'RAYMUNDO' AND last_name = 'GUERERO MACIAS' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'TIMOTEO' AND last_name = 'GUERRA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'DEL CARMEN GUERRERO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ELIEZER' AND last_name = 'HERBERT' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'GUILLERMO' AND last_name = 'MARMOLEJO HERNA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ARACELY' AND last_name = 'HERNANDEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'MANUELA HERNANDEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'EUNICE' AND last_name = 'HERNANDEZ-ADELEYE' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'CLARISSA' AND last_name = 'HERRERA GARCIA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'DE LA PAZ HOWEL' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'CRISTINA INTERIANO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'VICENTE' AND last_name = 'JAVIER VAZQUEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'DEICY JUANES' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ESTEBAN' AND last_name = 'BARRON JUAREZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'STEPHANIE' AND last_name = 'MARY LARES' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'SERGIO' AND last_name = 'J LEDESMA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ZAIRA' AND last_name = 'IVON LEON BENITEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'GLORIA' AND last_name = 'I LOPEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'KAREN' AND last_name = 'LOPEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ROBERTO' AND last_name = 'LOPEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ROSA' AND last_name = 'STELA LOPEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ROSARIO' AND last_name = 'LOPEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'SANDRA' AND last_name = 'LOPEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'DE LOS ANGELES SANCHEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'VANESSA' AND last_name = 'LUEVANOS VILLARREAL' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSE' AND last_name = 'LUIS RAMIREZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'LAURA' AND last_name = 'YESENIA LULE' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'NADIA' AND last_name = 'LUZ BITTER' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'ELENA MALDONADO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ALAN' AND last_name = 'OSVALDO MARTINEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ESTEBAN' AND last_name = 'MARTINEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'HERIBERTO' AND last_name = 'MARTINEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSE' AND last_name = 'LUIS MARTINEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'OSCAR' AND last_name = 'MARTINEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'SANDRA' AND last_name = 'MARTINEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'AGUSTIN' AND last_name = 'MASCORRO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ALEJANDRA' AND last_name = 'MATA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'EZEQUIEL' AND last_name = 'ISABEL MEDINA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARTIN' AND last_name = 'MEDINA BADILLO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MANUEL' AND last_name = 'DE JESUS MEDINA ESPINO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'FRANCISCO' AND last_name = 'JERONIMO MELENDEZ CORONADO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'OSCAR' AND last_name = 'MENDOZA GARCIA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'LUIS' AND last_name = 'ALBERTO MENDOZA HERNANDEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSE' AND last_name = 'FELIPE MONTALVO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ELISEO' AND last_name = 'MONTAÑEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'GENARO' AND last_name = 'MONTELONGO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JUAN' AND last_name = 'MONTES' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'FIDENCIO' AND last_name = 'MORALES' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MA' AND last_name = 'EVELIA MORENO HURTADO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'EMMANUEL' AND last_name = 'NEGRETE MANCIO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'JUANA OLVERA DE RAMIREZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'HECTOR' AND last_name = 'OMAR GONZALEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'CESAREO' AND last_name = 'ORDONEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ALFONSO' AND last_name = 'ORNELAS' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'STEPHANIE' AND last_name = 'PACHECO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JUANA' AND last_name = 'MARIA PALMILLAS' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'DIANA' AND last_name = 'PALOMO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'IRMA' AND last_name = 'ANGELICA PARGA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'CLAUDIA' AND last_name = 'PATRICIA VILLARREAL' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'CESAR' AND last_name = 'ALEJANDRO PENA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'REYNALDO' AND last_name = 'PEÑA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'RUTH' AND last_name = 'PEÑA DE FLORES' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'BESLIN' AND last_name = 'PERAZA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ANTONIO' AND last_name = 'PEREZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'RODRIGO' AND last_name = 'PEREZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'DANIEL' AND last_name = 'PEREZ III' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSE' AND last_name = 'PLATA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'KEILA' AND last_name = 'DEL VALLE PORTILLO MERCADO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ELIZABETH' AND last_name = 'QUEZADA ANZUA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'CLARA' AND last_name = 'RAMIREZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'A CANO RAMIREZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'DELFINO' AND last_name = 'RAMIREZ BANUELOS' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'LEONARDO' AND last_name = 'RANGEL' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'CLAUDIA' AND last_name = 'RAZO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'LETICIA' AND last_name = 'RESENDIZ GONZALEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ELIAZAR' AND last_name = 'REYES' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSE' AND last_name = 'MANUEL REYES' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSE' AND last_name = 'SERGIO REYNA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MIGUEL' AND last_name = 'ANGEL RICO TORRES' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'NORMA' AND last_name = 'RIOS' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'PABLO' AND last_name = 'RODRIGUEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ARTURO' AND last_name = 'RODRIGUEZ JR' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'SILVIA' AND last_name = 'RODRIGUEZ LILI' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JESUS' AND last_name = 'ROJAS' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'BARBARA' AND last_name = 'RONDON' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'KAREN' AND last_name = 'ROSALES' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ERICK' AND last_name = 'ROSARIO ALARCON' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'DAVID' AND last_name = 'I. RUIZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'YAHAIRA' AND last_name = 'SANCHEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JUAN' AND last_name = 'MANUEL SANCHEZ FAJARDO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'EDITH' AND last_name = 'SANCHEZ MARTINEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'GLAFIRO' AND last_name = 'SANCHEZ PEREZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'NOELIA' AND last_name = 'SANDOVAL ALVARADO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'EVAN' AND last_name = 'SANTILLAN' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'RAMON' AND last_name = 'SANTOS' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ALICIA' AND last_name = 'SHAGUN RAMOS' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'NILTON' AND last_name = 'ALEXANDER SIERRA RIVERA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JORGE' AND last_name = 'SIERRRA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ROSITA' AND last_name = 'SILVA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MA' AND last_name = 'DEL SOCORRO SALAZAR' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JUAN' AND last_name = 'TAPIA ALMARAZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARCEL' AND last_name = 'TEST' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSE' AND last_name = 'MARVIN TOBAR' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSE' AND last_name = 'TOCA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JORGE' AND last_name = 'TORRES SANCHEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'DEL CARMEN TREJO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'CESAR' AND last_name = 'GUZMAN VALDEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ROSARIO' AND last_name = 'VALERO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'CLAUDIA' AND last_name = 'GREGORIA VARGAS RUIZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'FRANCISCO' AND last_name = 'JAVIER VAZQUEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'LILIANA' AND last_name = 'ADELINE VAZQUEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'RICARDO' AND last_name = 'ADAME VAZQUEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'KATIA' AND last_name = 'ARACELY VILLANUEVA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'LAURA' AND last_name = 'YAQUELIN VILLAREAL' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MAGDALENO' AND last_name = 'GABRIEL VILLARREAL' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'FRANCISCO' AND last_name = 'WISLAR' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'SEBASTIAN' AND last_name = 'YANEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JESSICA' AND last_name = 'A ZAMORA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA' AND last_name = 'LUISA ZAMORANO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JESUS' AND last_name = 'ZAVALA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'LEOPOLDO' AND last_name = 'ZUBIA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSE LUIS' AND last_name = 'AGUIERRE ROMO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'DAIYA ALONDRA' AND last_name = 'ALVARADO MENDOZA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ANDREINA MILAGROS' AND last_name = 'BARROETA NUNEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'RAFAEL' AND last_name = 'MATA BECERRA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JUAN JOSE' AND last_name = 'CARDOZA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JESUS' AND last_name = 'PINEDA CARRILLO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'YUVIA JUDITH' AND last_name = 'CARRILLO LOMAS' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'OSCAR ANTONIO' AND last_name = 'GONE CASTRO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSE MANUEL' AND last_name = 'DOROTEO ZUNIGA ROSAS' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'BLANCA YESENIA' AND last_name = 'GARZA RODRIGUEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA DEL' AND last_name = 'CARMEN GUERRERO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA DE' AND last_name = 'LA PAZ HOWEL' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA CRISTINA' AND last_name = 'INTERIANO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA DEICY' AND last_name = 'JUANES' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ESTEBAN' AND last_name = 'BARRON JUAREZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'SERGIO J' AND last_name = 'LEDESMA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'ZAIRA IVON' AND last_name = 'LEON BENITEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'GLORIA I' AND last_name = 'LOPEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA DE' AND last_name = 'LOS ANGELES SANCHEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'LAURA YESENIA' AND last_name = 'LULE' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA ELENA' AND last_name = 'MALDONADO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSE LUIS' AND last_name = 'MARTINEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'EZEQUIEL ISABEL' AND last_name = 'MEDINA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MANUEL DE' AND last_name = 'JESUS MEDINA ESPINO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'FRANCISCO JERONIMO' AND last_name = 'MELENDEZ CORONADO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'LUIS ALBERTO' AND last_name = 'MENDOZA HERNANDEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSE FELIPE' AND last_name = 'MONTALVO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MA EVELIA' AND last_name = 'MORENO HURTADO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA JUANA' AND last_name = 'OLVERA DE RAMIREZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JUANA MARIA' AND last_name = 'PALMILLAS' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'IRMA ANGELICA' AND last_name = 'PARGA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'CESAR ALEJANDRO' AND last_name = 'PENA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'KEILA DEL' AND last_name = 'VALLE PORTILLO MERCADO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA A' AND last_name = 'CANO RAMIREZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSE MANUEL' AND last_name = 'REYES' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSE SERGIO' AND last_name = 'REYNA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MIGUEL ANGEL' AND last_name = 'RICO TORRES' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'DAVID I.' AND last_name = 'RUIZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JUAN MANUEL' AND last_name = 'SANCHEZ FAJARDO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'NILTON ALEXANDER' AND last_name = 'SIERRA RIVERA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MA DEL' AND last_name = 'SOCORRO SALAZAR' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JOSE MARVIN' AND last_name = 'TOBAR' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA DEL' AND last_name = 'CARMEN TREJO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'CESAR' AND last_name = 'GUZMAN VALDEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'CLAUDIA GREGORIA' AND last_name = 'VARGAS RUIZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'FRANCISCO JAVIER' AND last_name = 'VAZQUEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'LILIANA ADELINE' AND last_name = 'VAZQUEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'RICARDO ADAME' AND last_name = 'VAZQUEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'KATIA ARACELY' AND last_name = 'VILLANUEVA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MAGDALENO GABRIEL' AND last_name = 'VILLARREAL' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'JESSICA A' AND last_name = 'ZAMORA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE first_name = 'MARIA LUISA' AND last_name = 'ZAMORANO' ORDER BY date_entered DESC LIMIT 1;
delete from contacts where first_name = 'rafael mata' and last_name = 'becerra' order by date_entered DESC LIMIT 1;
delete from contacts where first_name = 'jesus' and last_name = 'pineda carrillo' order by date_entered DESC LIMIT 1;
delete from contacts where first_name = 'jesus pineda' and last_name = 'carrillo' order by date_entered DESC LIMIT 1;
delete from contacts where CONCAT(first_name, ' ', last_name) = 'MARIA DEL CARMEN GUERRERO' order by date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE CONCAT(first_name, ' ', last_name) = 'MARIA DE LA PAZ HOWEL' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE CONCAT(first_name, ' ', last_name) = 'ESTEBAN BARRON JUAREZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE CONCAT(first_name, ' ', last_name) = 'MANUEL DE JESUS MEDINA ESPINO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE CONCAT(first_name, ' ', last_name) = 'KEILA DEL VALLE PORTILLO MERCADO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE CONCAT(first_name, ' ', last_name) = 'MARIA A CANO RAMIREZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE CONCAT(first_name, ' ', last_name) = 'MARIA DEL CARMEN TREJO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE CONCAT(first_name, ' ', last_name) = 'MA ROSARIO VERA  HURTADO' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE CONCAT(first_name, ' ', last_name) = 'MARIA ELENA FAVELA  OLVERA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE CONCAT(first_name, ' ', last_name) = 'LUIS ALBERTO SALAZAR  MARTINEZ' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE CONCAT(first_name, ' ', last_name) = 'IRINEO SANCHEZ DE  LA ROSA' ORDER BY date_entered DESC LIMIT 2;
DELETE FROM contacts WHERE CONCAT(first_name, ' ', last_name) = 'MARIA ABIGAIL PEÑA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE CONCAT(first_name, ' ', last_name) = 'silvia lopez' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE CONCAT(first_name, ' ', last_name) = 'DOLORES ALEJANDRO LEON  CORTEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE CONCAT(first_name, ' ', last_name) = 'CLAUDIA GREGORIA VARGAS  RUIZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE CONCAT(first_name, ' ', last_name) = 'CESAR GUZMAN VALDEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE CONCAT(first_name, ' ', last_name) = 'J MERCED ULISES  DE LEON' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE CONCAT(first_name, ' ', last_name) = 'CHRISTIAN ARTURO HINOJOSA FLORES' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE CONCAT(first_name, ' ', last_name) = 'LUIS ALBERTO MENDOZA  HERNANDEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE CONCAT(first_name, ' ', last_name) = 'MA DEL SOCORRO  SALAZAR' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE CONCAT(first_name, ' ', last_name) = 'MA EVELIA MORENO  HURTADO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE CONCAT(first_name, ' ', last_name) = 'JOSE LUIS NIETO  ROBLES' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE CONCAT(first_name, ' ', last_name) = 'FATIMA GUADALUPE SALDIERNA' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE CONCAT(first_name, ' ', last_name) = 'OSVALDO ROMERO MARIN' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE CONCAT(first_name, ' ', last_name) = 'GONZALO ALBERTO GARCIA  CEBALLOS' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE CONCAT(first_name, ' ', last_name) = 'GENESIS DANIELA VAZQUEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE CONCAT(first_name, ' ', last_name) = 'Ma Del Carmen Garcia' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE CONCAT(first_name, ' ', last_name) = 'JOSE MANUEL DOROTEO  ZUNIGA ROSAS' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE REPLACE(CONCAT(first_name, ' ', last_name), '  ', ' ') = 'EYLEEN CARRION TORRES' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE REPLACE(CONCAT(first_name, ' ', last_name), '  ', ' ') = 'JOSE LUIS AGUIERRE ROMO' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE REPLACE(CONCAT(first_name, ' ', last_name), '  ', ' ') = 'MARIA DE LOS ANGELES SANCHEZ' ORDER BY date_entered DESC LIMIT 1;
DELETE FROM contacts WHERE REPLACE(CONCAT(first_name, ' ', last_name), '  ', ' ') = 'SAMANTHA MELISSA FIGUEROA' ORDER BY date_entered DESC LIMIT 1;
delete from contacts WHERE CONCAT(first_name,last_name) LIKE '%test%';
delete from contacts WHERE CONCAT(first_name,last_name) LIKE '%prueba%';
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '445fb9eb-3c20-39d0-0505-5cddd1cf9ca2' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = 'f01d948d-f5fd-8715-920e-5cddd189a2e8' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '2c71894b-7f45-00aa-a782-5cddd1a1e5e9' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = 'e0be7027-cdd3-8279-80b0-5cddd0152b3e' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '3b49103c-532a-56f0-b84b-5cddd14059d5' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '47605bcf-464c-61cf-3658-5cddd102dfc1' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '1170b596-9e2a-4f0b-836d-5cddd1a3b93e' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = 'd24d8eaa-4795-f0d6-db95-5cddd1c94402' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '1335f766-8641-ad8d-3084-5cddd19c17e7' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '195505f2-143d-9fe1-1bc8-5e6100edbdd1' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '43c4b2e6-5455-adc4-94ed-5cddd1f50b02' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = 'e23a2002-d496-e793-6bb7-5d83c5554798' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = 'e42f20c8-f9b1-b4fa-f605-5e6bc06e5d26' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '97a2ed04-ef32-9867-03b5-645ae002c326' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = 'c241040f-f352-a112-bf2b-664cceb2cbf1' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = 'd6550269-571d-f069-a138-5cddd128a7dc' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '48be7bed-e051-f95e-dbef-5caa66ae4228' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = 'ca085003-b49e-c703-f821-5ebea8c4f01a' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '85990a22-f545-d5d9-99a7-5cddd1acda06' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '7ef734a6-d2f5-7e9b-639d-5cddd101e08c' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '7fde692a-f6d3-5596-d17b-5d4c53a8a84d' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '9a36ac7e-e5bd-e56b-72de-5d9def76b149' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = 'd577149b-097e-96e2-3346-60a4253232c7' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '1086aaee-a36f-d17f-93c0-62631ad0b5ea' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '172aa75e-e477-13da-ee80-5de74e51ffae' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '762f0e5b-21e3-5815-52bb-673e68c0fe19' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '71c7aa04-843e-e84a-d74b-673e68b9a3b0' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = 'c9e428d0-845d-da4e-3ac2-6737cea6d515' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '12b1cde7-3378-3212-dd75-6109afee9226' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '445fb9eb-3c20-39d0-0505-5cddd1cf9ca2' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '6a4ba0cb-8586-10d3-fce7-671fcc678621' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = 'a5f9ecf2-0b7a-94b0-d018-671fcc9832fc' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = 'f01d948d-f5fd-8715-920e-5cddd189a2e8' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '2c3472d8-7e45-ba8a-6406-5caa6ef3ee9e' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = 'c82f7925-dd16-5fa7-8218-60916f288f9f' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '17732f50-4228-1648-2352-623b85368cea' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = 'e8479799-ec8b-d8cf-c780-5caf37ccaf3b' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = 'c14c9743-a6bb-1eb0-8e5c-67201c106944' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = 'b9bc909a-b8fc-b0c2-e1a3-62ab50cbd22a' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '783d792b-7cc4-0c50-a342-5cddd1208e23' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = 'dcfb4de6-5b29-bbb5-15b5-66bfe248c62e' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = 'ccf15e8f-c2cc-96f5-8b90-66b3a1041c0a' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '2c71894b-7f45-00aa-a782-5cddd1a1e5e9' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = 'e0be7027-cdd3-8279-80b0-5cddd0152b3e' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '3b49103c-532a-56f0-b84b-5cddd14059d5' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '17576a9d-29d1-100a-6e04-6234ccf947bd' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '6a9d24aa-b893-da60-ff75-5f33ff0ee4f8' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = 'd10e0090-158b-ad3e-18c0-63e13e92e3e7' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '96ea55e6-4498-447e-5d25-659c37df0535' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '33d8ff9c-bd77-829b-eb64-5cddd1b49a99' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = 'b455ddd4-8103-9589-8ebd-5cddd1c7cdb9' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '56a32584-9b1f-25de-2053-60d38f6f55fd' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '964a970c-39b0-78d6-ada3-66d0ab897d4c' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = 'c2f14d09-3022-6dc8-f1ea-671ff05ac397' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '37db3b8d-7187-e0a6-9545-66d0a43d3d04' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '9938f7c9-3468-e624-0b1e-671ff0241cf1' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = 'b589bd6d-3ea6-8799-8885-5e6ab4bef091' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '32207642-673b-4fdd-f391-5d37293d4abe' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '9e598ccc-43e8-0734-3274-5cddd16f800c' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = 'bd234795-8498-a71a-f67c-66510c284bfa' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '47605bcf-464c-61cf-3658-5cddd102dfc1' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '1170b596-9e2a-4f0b-836d-5cddd1a3b93e' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = 'c9be6904-07b3-bd6b-12de-60f8a2b61c98' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = 'e9cdb98e-313b-41c6-893f-66feac342a8e' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '67501588-85c6-d060-2df8-5cddd1760b57' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '7b913080-3531-b130-3bba-5e3d91e81ed3' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '7a5b02bd-11e6-5cb0-518e-5e1a12f8965e' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = 'd24d8eaa-4795-f0d6-db95-5cddd1c94402' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '3067468f-79a7-f4ea-560a-62868d6d1f03' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '6d7a0c96-cf07-f784-2418-62868ea1d7d1' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '1335f766-8641-ad8d-3084-5cddd19c17e7' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '607b8daa-80d2-62fb-1403-5cddd1ddb1f0' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '587d0607-a30f-94c5-f4c2-626c062cae09' ORDER BY date_modified LIMIT 1;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '2c1d2581-9814-8bea-4ee6-5cddd1933b3d' ORDER BY date_modified LIMIT 2;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '1eb426ca-2dc6-3cb4-be40-5cddd1375379' ORDER BY date_modified LIMIT 2;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = 'e8f8e801-7d78-4e01-f6d5-5eebaaa093c8' ORDER BY date_modified LIMIT 2;
DELETE FROM contacts_cases_1_c WHERE contacts_cases_1cases_idb = '6ed1db87-576c-f6bf-3dd1-5cddd1b71b1e' ORDER BY date_modified LIMIT 2;
INSERT INTO gestion_equipo_legal.clientes (nombre,telefono1,telefono2,telefono3, domicilio, ciudad, cp, referido, oficina, clasificacion, registrado, creador) SELECT UPPER(CONCAT(TRIM(suite_dotgital.contacts.first_name), ' ', TRIM(suite_dotgital.contacts.last_name))), suite_dotgital.contacts.phone_mobile, suite_dotgital.contacts.phone_home, suite_dotgital.contacts.phone_other, suite_dotgital.contacts.primary_address_street, suite_dotgital.contacts.primary_address_city, suite_dotgital.contacts.primary_address_postalcode, 1, 1, 'CLIENTE', suite_dotgital.contacts.date_entered, 1 from suite_dotgital.contacts_cases_1_c JOIN suite_dotgital.contacts ON suite_dotgital.contacts.id=suite_dotgital.contacts_cases_1_c.contacts_cases_1contacts_ida JOIN suite_dotgital.cases ON suite_dotgital.cases.id = suite_dotgital.contacts_cases_1_c.contacts_cases_1cases_idb group by suite_dotgital.contacts.id order by suite_dotgital.contacts.date_entered;
use gestion_equipo_legal;
update clientes set nombre = REPLACE(nombre, '  ',' ');
update clientes set domicilio = TRIM(UPPER(domicilio));
update clientes set ciudad = TRIM(UPPER(ciudad));
update clientes set nombre = REPLACE(nombre, '"', '');
update clientes set domicilio = REPLACE(domicilio, '"', '');
UPDATE clientes SET telefono1 = REGEXP_REPLACE(telefono1, '[^0-9]', '');
UPDATE clientes SET telefono2 = REGEXP_REPLACE(telefono2, '[^0-9]', '');
UPDATE clientes SET telefono3 = REGEXP_REPLACE(telefono3, '[^0-9]', '');
UPDATE clientes SET cp = REGEXP_REPLACE(cp, '[^0-9]', '');
use suite_dotgital;
UPDATE cases SET type = 4 WHERE type is null;
UPDATE cases SET type = 2 WHERE type = 'Immigration';
UPDATE cases SET type = 90 WHERE type = 'tickets';
UPDATE cases SET type = 1 WHERE type = 'criminaldefense';
UPDATE cases SET type = 3 WHERE type = 'deportation';
UPDATE cases SET type = 6 WHERE type = 'divorce';
UPDATE cases SET type = 5 WHERE type = 'personalinjury';
UPDATE cases SET status = 0 WHERE status is null;
UPDATE cases SET status = 2 WHERE status = 'canceled' OR status = 'closed_closed' OR status = 'closed_rejected';
UPDATE cases SET status = 5 WHERE status = 'completed';
UPDATE cases SET status = 6 WHERE status = 'denial';
UPDATE cases SET status = 4 WHERE status = 'hold' OR status = 'pending';
UPDATE cases SET status = 3  WHERE status = 'sent';
UPDATE cases SET status = 1 WHERE status = 'open_assigned' OR status = 'open_new';
INSERT INTO gestion_equipo_legal.casos (
    id, idbeneficiario, idcliente, fecha, caso, tipo, subclase,
    status, creador, asignado, capturadedatos, califica, motivo_califica
)
SELECT 
    suite_dotgital.cases.case_number,
    '0',
    COALESCE((
        SELECT id FROM gestion_equipo_legal.clientes 
        WHERE gestion_equipo_legal.clientes.nombre = 
            REPLACE(UPPER(CONCAT(REPLACE(TRIM(suite_dotgital.contacts.first_name), '  ', ' '), ' ', REPLACE(TRIM(suite_dotgital.contacts.last_name), '  ', ' '))), '"', '')
    ), '1') AS idcliente,
    suite_dotgital.cases.date_entered,
    UPPER(TRIM(suite_dotgital.cases.name)),
    suite_dotgital.cases.type,
    '0',
    suite_dotgital.cases.status,
    '3',
    '3',
    '0',
    '3',
    ''
FROM suite_dotgital.contacts_cases_1_c
JOIN suite_dotgital.contacts 
    ON suite_dotgital.contacts.id = suite_dotgital.contacts_cases_1_c.contacts_cases_1contacts_ida
JOIN suite_dotgital.cases 
    ON suite_dotgital.cases.id = suite_dotgital.contacts_cases_1_c.contacts_cases_1cases_idb
JOIN suite_dotgital.users 
    ON suite_dotgital.users.id = suite_dotgital.cases.created_by
LEFT JOIN suite_dotgital.users AS asignado_user 
    ON suite_dotgital.asignado_user.id = suite_dotgital.cases.assigned_user_id
ORDER BY suite_dotgital.cases.case_number;
use gestion_equipo_legal;
update casos set subclase = 47 WHERe tipo = 5;
update casos set tipo = 1 WHERE tipo = 5;
update casos set subclase = 41 WHERE tipo = 6;
update casos set fecha = '2018-08-12 14:02:25' WHERE idcliente = 365;
UPDATE casos SET fecha = STR_TO_DATE(CONCAT('2019-', LPAD(MONTH(fecha), 2, '0'), '-', LPAD(DAY(fecha), 2, '0')), '%Y-%m-%d') WHERE YEAR(fecha) = 19;
use suite_dotgital;
INSERT INTO gestion_equipo_legal.beneficiarios (
    nombre, telefono1, telefono2, pertenecetel2, domicilio, ciudad, cp, relacion, cliente
)
SELECT
    CONCAT(TRIM(d_ben_beneficiary.first_name), ' ', TRIM(d_ben_beneficiary.last_name)),
    d_ben_beneficiary.phone_mobile,
    d_ben_beneficiary.phone_home,
    cases.case_number,
    d_ben_beneficiary.primary_address_street,
    d_ben_beneficiary.primary_address_city,
    d_ben_beneficiary.primary_address_postalcode,
    cases_cstm.beneficiary_relationship_c,
    '1'
FROM 
    suite_dotgital.cases_d_ben_beneficiary_1_c
JOIN 
    suite_dotgital.d_ben_beneficiary 
    ON d_ben_beneficiary.id = cases_d_ben_beneficiary_1_c.cases_d_ben_beneficiary_1d_ben_beneficiary_idb
JOIN 
    suite_dotgital.cases 
    ON cases.id = cases_d_ben_beneficiary_1_c.cases_d_ben_beneficiary_1cases_ida
JOIN 
    suite_dotgital.cases_cstm 
    ON cases_cstm.case_number_custom_c = cases.case_number;
use gestion_equipo_legal;
update beneficiarios SET nombre = UPPER(TRIM(nombre));
delete from beneficiarios where nombre = '' and id != 0;
DELETE FROM beneficiarios WHERE nombre = 'Cruz';
DELETE FROM beneficiarios WHERE nombre = 'Test Beneficiary';
DELETE FROM beneficiarios WHERE nombre = '1 1';
DELETE FROM beneficiarios WHERE nombre = '123123 123123';
DELETE FROM beneficiarios WHERE nombre = '231231 123123';
DELETE FROM beneficiarios WHERE nombre = '333333 33333';
DELETE FROM beneficiarios WHERE nombre = 'ahora si sr';
DELETE FROM beneficiarios WHERE nombre = 'anoter asdasd';
DELETE FROM beneficiarios WHERE nombre = 'Another Beneficiary TEST';
DELETE FROM beneficiarios WHERE nombre = 'another TEST';
DELETE FROM beneficiarios WHERE nombre = 'asads asfasfa';
DELETE FROM beneficiarios WHERE nombre = 'ascaasda asdasda';
DELETE FROM beneficiarios WHERE nombre = 'ascas ascasa';
DELETE FROM beneficiarios WHERE nombre = 'asdasd asdasd';
DELETE FROM beneficiarios WHERE nombre = 'asdasd dasdasd';
DELETE FROM beneficiarios WHERE nombre = 'asfdad asdasd';
DELETE FROM beneficiarios WHERE nombre = 'asxasxasxas asxasx';
DELETE FROM beneficiarios WHERE nombre = 'csdczdczsda scacads';
DELETE FROM beneficiarios WHERE nombre = 'fdafdad dasdas';
DELETE FROM beneficiarios WHERE nombre = 'Mrcel test';
DELETE FROM beneficiarios WHERE nombre = 'New pa';
DELETE FROM beneficiarios WHERE nombre = 'new related';
DELETE FROM beneficiarios WHERE nombre = 'new TEST';
DELETE FROM beneficiarios WHERE nombre = 'Nievo asdas';
DELETE FROM beneficiarios WHERE nombre = 'ONE MNORe';
DELETE FROM beneficiarios WHERE nombre = 'one more one more';
DELETE FROM beneficiarios WHERE nombre = 'qew qwe';
DELETE FROM beneficiarios WHERE nombre = 'qwdqwd qwdqwd';
DELETE FROM beneficiarios WHERE nombre = 'qwdqwdqdqw dqwdqwd';
DELETE FROM beneficiarios WHERE nombre = 'qwe qwe';
DELETE FROM beneficiarios WHERE nombre = 'qwe qwe';
DELETE FROM beneficiarios WHERE nombre = 'sdfsdf sdfdf';
DELETE FROM beneficiarios WHERE nombre = 'TAST TAST';
DELETE FROM beneficiarios WHERE nombre = 'TEST TEST';
DELETE FROM beneficiarios WHERE nombre = 'TEST TEST';
DELETE FROM beneficiarios WHERE nombre = 'TESTI TESTI';
DELETE FROM beneficiarios WHERE nombre = 'TIST TIST';
DELETE FROM beneficiarios WHERE nombre = 'TIST TIST';
DELETE FROM beneficiarios WHERE nombre = 'TOST TOST';
DELETE FROM beneficiarios WHERE nombre = 'TUST TUST';
DELETE FROM beneficiarios WHERE nombre = 'wer wer';
DELETE FROM beneficiarios WHERE nombre = 'www wwww';
DELETE FROM beneficiarios WHERE nombre = 'Marcel beneficiary';
DELETE FROM beneficiarios WHERE nombre = 'Marcel beneficiary test';
delete from beneficiarios where id IN (7, 228, 229, 1, 151, 165);
UPDATE beneficiarios b JOIN casos c ON b.pertenecetel2 = c.id SET b.cliente = c.idcliente;
UPDATE beneficiarios SET cliente = 1, pertenecetel2 = '' WHERE id = 0;
-- HACER MANUALMENTE POR LAS CLAVES FORANEAS
delete from beneficiarios WHERE cliente = 1 AND pertenecetel2 != 10941 AND pertenecetel2 != 12751 AND pertenecetel2 != 11838;
--
UPDATE beneficiarios SET telefono1 = REGEXP_REPLACE(telefono1, '[^0-9]', '');
UPDATE beneficiarios SET telefono2 = REGEXP_REPLACE(telefono2, '[^0-9]', '');
UPDATE beneficiarios SET cp = REGEXP_REPLACE(cp, '[^0-9]', '');
UPDATE beneficiarios SET pertenecetel2 = '';
UPDATE beneficiarios SET domicilio = UPPER(TRIM(domicilio));
UPDATE beneficiarios SET ciudad = UPPER(TRIM(ciudad));
UPDATE beneficiarios SET email = UPPER(TRIM(email));
UPDATE beneficiarios SET relacion = UPPER(TRIM(relacion));
update users set user_name = 9 WHERE user_name = 'alopez';
update users set user_name = 5 WHERE user_name = 'aoros';
update users set user_name = 6 WHERE user_name = 'asoto';
update users set user_name = 13 WHERE user_name = 'brenda';
update users set user_name = 14 WHERE user_name = 'dalfaro';
update users set user_name = 15 WHERE user_name = 'jessica';
update users set user_name = 12 WHERE user_name = 'karla';
update users set user_name = 4 WHERE user_name = 'keila';
update users set user_name = 7 WHERE user_name = 'lcisneros';
update users set user_name = 2 WHERE user_name = 'los andes';
update users set user_name = 7 WHERE user_name = 'luis';
update users set user_name = 16 WHERE user_name = 'rmartinez';
UPDATE users SET user_name = 3 WHERE user_name IN (
    'amonroy',
    'balonso',
    'bea',
    'broreception',
    'chenriquez',
    'collervides',
    'ctaboada',
    'ctruong',
    'dotgital',
    'drodriguez',
    'dromero',
    'eacosta',
    'ecrawford',
    'Emely',
    'gcantu',
    'gchinchilla',
    'gcruz',
    'goyervidez',
    'jaquelyn',
    'jparada',
    'jreyna',
    'khernandez',
    'kpena',
    'lavalos',
    'lgarcia',
    'lhernandez',
    'lleticia',
    'llucero',
    'lortega',
    'marcelcruz85',
    'Martha',
    'mdiaz',
    'mvirgen',
    'nablasol',
    'napellido',
    'Nayra',
    'ohenriquez',
    'rguadalupe',
    'scortez',
    'slopez',
    'smena',
    'ssalim',
    'ssilvia',
    'ygranados',
    'yyobanha',
    'zfonseca',
    'Zuleta',
    'admin',
    'acastillo',
    ''
);
UPDATE aop_case_updates SET description = REPLACE(description, '"', '');
UPDATE aop_case_updates SET description = REPLACE(description, '*', '');
UPDATE aop_case_updates SET description = REPLACE(description, '<P>', '');
UPDATE aop_case_updates SET description = REPLACE(description, '<BR />', '');
UPDATE aop_case_updates SET description = REPLACE(description, '</P>', '');
UPDATE aop_case_updates SET description = UPPER(TRIM(description));
DELETE FROM aop_case_updates WHERE description = '';
DELETE FROM aop_case_updates WHERE name = 'this is a test 4';
DELETE FROM aop_case_updates WHERE description IN ('', '.', '<BR />', '123123123', 'notas', 'another note', 'note');
INSERT INTO gestion_equipo_legal.casos_actualizaciones (
    idcaso, creado, actualizacion, agente, esresultado
)
SELECT 
    c.case_number,
    a.date_entered,
    a.description,
    u.user_name,
    '0'
FROM aop_case_updates a
JOIN cases c ON c.id = a.case_id
JOIN users u ON u.id = a.created_by
JOIN gestion_equipo_legal.casos gcaso ON gcaso.id = c.case_number
ORDER BY a.date_entered;
INSERT INTO citas (cliente, caso, fecha, hora, tipo, status, creador, asignado) select idcliente, id, DATE_FORMAT(fecha, '%Y-%m-%d'), CONCAT(HOUR(fecha),':00:00'), 1, 1, creador, asignado from casos GROUP BY id ORDER BY fecha ASC;