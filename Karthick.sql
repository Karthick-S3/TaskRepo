select * from companydetail

select * from contactdetail

select * from countrydetail

select * from statedetail

select * from citydetail



SELECT cd.companyid, 
       cd.companyname,  
       con.contact, 
       cd.companyshortname, 
       cd.address, 
       cd.zipcode, 
       cd.active, 
       co.country, 
       st.state, 
       ci.city 
FROM companydetail cd 
JOIN countrydetail co ON co.cid = cd.cid 
JOIN statedetail st ON st.sid = cd.sid 
JOIN citydetail ci ON ci.cityid = cd.cityid 
JOIN contactdetail con ON con.contactid = cd.contactid 
WHERE co.cid IN (2000) 
  AND st.sid IN (3000) 
  AND ci.cityid IN (4001);










SELECT s.state
FROM statedetail s
JOIN countrydetail c ON s.cid = c.cid
WHERE c.cid IN (2000,2001)

SELECT s.state,s.sid,s.cid
FROM statedetail s
JOIN countrydetail c ON s.cid = c.cid
WHERE c.cid IN (2000,2001)

SELECT cit.city,cit.cid,cit.sid
FROM citydetail cit
JOIN statedetail s ON cit.sid = s.sid
WHERE s.sid IN (3000,3001)





SELECT cd.companyid, 
       cd.companyname,  
       con.contact, 
       cd.companyshortname, 
       cd.address, 
       cd.zipcode, 
       cd.active, 
       co.country, 
       st.state, 
       ci.city ,
       con.contactid
FROM companydetail cd 
JOIN countrydetail co ON co.cid = cd.cid 
JOIN statedetail st ON st.sid = cd.sid 
JOIN citydetail ci ON ci.cityid = cd.cityid 
JOIN contactdetail con ON con.contactid = cd.contactid 

  

  
  
  
  


-------------------------------------Country call --------------------------------------------------------
SELECT cd.companyid, 
       cd.companyname,  
       con.contact, 
       cd.companyshortname, 
       cd.address, 
       cd.zipcode, 
       cd.active, 
       co.country, 
       st.state, 
       ci.city 
FROM companydetail cd 
JOIN countrydetail co ON co.cid = cd.cid 
JOIN statedetail st ON st.sid = cd.sid 
JOIN citydetail ci ON ci.cityid = cd.cityid 
JOIN contactdetail con ON con.contactid = cd.contactid 
WHERE co.cid IN (2000,2001);



---------------------------------------------- state calll-------------------------

SELECT cd.companyid, 
       cd.companyname,  
       con.contact, 
       cd.companyshortname, 
       cd.address, 
       cd.zipcode, 
       cd.active, 
       co.country, 
       st.state, 
       ci.city 
FROM companydetail cd 
JOIN countrydetail co ON co.cid = cd.cid 
JOIN statedetail st ON st.sid = cd.sid 
JOIN citydetail ci ON ci.cityid = cd.cityid 
JOIN contactdetail con ON con.contactid = cd.contactid 
WHERE (st.sid IN (3000, 3001) OR st.sid IS NULL) ;



----------------------------------------------city call ---------------------------------------------


SELECT cd.companyid, 
       cd.companyname,  
       con.contact, 
       cd.companyshortname, 
       cd.address, 
       cd.zipcode, 
       cd.active, 
       co.country, 
       st.state, 
       ci.city 
FROM companydetail cd 
JOIN countrydetail co ON co.cid = cd.cid 
JOIN statedetail st ON st.sid = cd.sid 
JOIN citydetail ci ON ci.cityid = cd.cityid 
JOIN contactdetail con ON con.contactid = cd.contactid 
WHERE (ci.cityid IN (4000,4001,4002) OR ci.cityid IS NULL);

------------------------------------------------------------------------------------------------------

alter table companydetail
add Establish_date date



alter table companydetail
add Revenue decimal(10,2);






CREATE OR REPLACE PACKAGE COMPANYDETAIL_PACKAGE AS
 PROCEDURE getCountry (OUT_COUNTRY OUT SYS_REFCURSOR);
 PROCEDURE getState (OUT_STATE OUT SYS_REFCURSOR);
 PROCEDURE getCity (OUT_CITY OUT SYS_REFCURSOR);
 PROCEDURE getAllCompany (OUT_ALLCOMPANY OUT SYS_REFCURSOR);
END COMPANYDETAIL_PACKAGE;

CREATE OR REPLACE PACKAGE BODY COMPANYDETAIL_PACKAGE AS
    PROCEDURE getCountry(OUT_COUNTRY OUT SYS_REFCURSOR) IS
        BEGIN 
            OPEN OUT_COUNTRY FOR
            select * from countrydetail;
        END getCountry;
        
    PROCEDURE getState(OUT_STATE OUT SYS_REFCURSOR) IS
        BEGIN 
            OPEN OUT_STATE FOR
            Select * from statedetail;
        END getState;
        
    PROCEDURE getCity(OUT_CITY OUT SYS_REFCURSOR) IS
        BEGIN 
            OPEN OUT_CITY FOR
            Select * from citydetail;
        END getCity;
        
    PROCEDURE getAllCompany(OUT_ALLCOMPANY OUT SYS_REFCURSOR) IS
        BEGIN 
            OPEN OUT_ALLCOMPANY FOR
            SELECT  cd.companyid, cd.companyname,  con.contact, cd.companyshortname,
            cd.address, cd.zipcode, cd.active, co.country, st.state, ci.city,cd.establish_date,cd.REVENUE
            FROM companydetail cd
            JOIN countrydetail co ON co.cid = cd.cid
            JOIN statedetail st ON st.sid = cd.sid
            JOIN citydetail ci ON ci.cityid = cd.cityid
            join contactdetail con On con.contactid = cd.contactid;
        END getAllCompany;
    
    
END COMPANYDETAIL_PACKAGE;









------------------------------------------------------------------------------------------------------------------------------------

CREATE OR REPLACE PACKAGE SORTING_PACKAGE AS 
PROCEDURE SortField (OUT_SORTING OUT SYS_REFCURSOR,P_val in VARCHAR2);





SELECT  cd.companyid, cd.companyname,  con.contact, cd.companyshortname,
            cd.address, cd.zipcode, cd.active, co.country, st.state, ci.city,cd.establish_date,cd.REVENUE
            FROM companydetail cd
            JOIN countrydetail co ON co.cid = cd.cid
            JOIN statedetail st ON st.sid = cd.sid
            JOIN citydetail ci ON ci.cityid = cd.cityid
            join contactdetail con On con.contactid = cd.contactid
            order by st.state;
            
            
            
CREATE OR REPLACE PROCEDURE try (
    p_val IN VARCHAR2,
    p_result OUT SYS_REFCURSOR
)
IS
    v_sql_query VARCHAR2(1000);
BEGIN
    v_sql_query := 'SELECT cd.companyid, cd.companyname, con.contact, cd.companyshortname,
                            cd.address, cd.zipcode, cd.active, co.country, st.state, ci.city,cd.establish_date,cd.REVENUE
                    FROM companydetail cd
                    JOIN countrydetail co ON co.cid = cd.cid
                    JOIN statedetail st ON st.sid = cd.sid
                    JOIN citydetail ci ON ci.cityid = cd.cityid
                    JOIN contactdetail con ON con.contactid = cd.contactid
                    ORDER BY ' || p_val;

    OPEN p_result FOR v_sql_query;
END try;

DECLARE
    v_cursor SYS_REFCURSOR;
BEGIN
    try(
        p_val => 'st.state',
        p_result => v_cursor
    );
END;



update companydetail set companyname='ABC Corp' where companyid=1






SELECT 
    cd.companyid, cd.companyname, con.contact, cd.companyshortname,
    cd.address, cd.zipcode, cd.active, co.country, st.state, ci.city,
    cd.establish_date, cd.REVENUE
FROM 
    companydetail cd
JOIN 
    countrydetail co ON co.cid = cd.cid
JOIN 
    statedetail st ON st.sid = cd.sid
JOIN 
    citydetail ci ON ci.cityid = cd.cityid
JOIN 
    contactdetail con ON con.contactid = cd.contactid
    
    
WHERE 
    LOWER(cd.companyname) LIKE LOWER('%inc%')
    
    
ORDER BY 
    st.state;


--------------------------------------------------------------------------------------------------

CREATE OR REPLACE PACKAGE LAZY_PACKAGE AS
TYPE GET_TABLE_DATA IS REF CURSOR,
PROCEDURE GET_TABLE(
S_FIELDNAME IN VARCHAR2 DEFAULT NULL,
S_FIELD_VALUE IN VARCHAR2 DEFAULT NULL,
ORDER_FIELD IN VARCHAR2 DEFAULT NULL);
END LAZY_PACKAGE;


CREATE OR REPLACE PACKAGE BODY LAZY_PACKAGE AS
PROCEDURE GET_TABLE(
S_FIELDNAME IN VARCHAR2 DEFAULT NULL,
S_FIELD_VALUE IN VARCHAR2 DEFAULT NULL,
ORDER_FIELD IN VARCHAR2 DEFUALT NULL)
IS 
GET_TABLE_DATA_CUR GET_TABLE_DATA;
SQL_QUERY VARCHAR(1000);
BEGIN
SQL_QUERY := SELECT cd.companyid, cd.companyname, con.contact, cd.companyshortname,
                            cd.address, cd.zipcode, cd.active, co.country, st.state, ci.city,
                            cd.establish_date, cd.REVENUE
                     FROM companydetail cd
                     JOIN countrydetail co ON co.cid = cd.cid
                     JOIN statedetail st ON st.sid = cd.sid
                     JOIN citydetail ci ON ci.cityid = cd.cityid
                     JOIN contactdetail con ON con.contactid = cd.contactid';
     IF S_FIELDNAME IS NOT NULL THEN
                sql_query := sql_query || ' WHERE LOWER(' || S_FIELDNAME || ') LIKE LOWER(' || S_FIELD_VALUE || ')';
            END IF;
    IF ORDER_FIELD IS NOT NULL THEN
            sql_query := sql_query || ' ORDER BY ' || ORDER_FIELD;
        END IF;
    
    OPEN GET_TABLE_DATA_CUR FOR SQL_QUERY;
END GET_TABLE;
END LAZY_PACKAGE;
            
        
        
        
        
        
        
        

SELECT 
    cd.companyid, cd.companyname, con.contact, cd.companyshortname,
    cd.address, cd.zipcode, cd.active, co.country, st.state, ci.city,
    cd.establish_date, cd.REVENUE,
    COUNT(*) OVER() AS total_records
    
FROM 
    companydetail cd
JOIN 
    countrydetail co ON co.cid = cd.cid
JOIN 
    statedetail st ON st.sid = cd.sid
JOIN 
    citydetail ci ON ci.cityid = cd.cityid
JOIN 
    contactdetail con ON con.contactid = cd.contactid
    
WHERE  lower(country) like lower('%india%')
    AND 
   co.cid IN (2000) 
    AND st.sid IN (3000,3001,3002) 
    AND ci.cityid IN (4000,4001,4002,4003)


order by ci.city;


SELECT COUNT(*) AS total_records
FROM 
    companydetail cd
JOIN 
    countrydetail co ON co.cid = cd.cid
JOIN 
    statedetail st ON st.sid = cd.sid
JOIN 
    citydetail ci ON ci.cityid = cd.cityid
JOIN 
    contactdetail con ON con.contactid = cd.contactid
    
WHERE  lower(country) like lower('%india%')
    AND 
   co.cid IN (2000) 
    AND st.sid IN (3000,3001,3002) 
    AND ci.cityid IN (4000,4001,4002,4003);

            
            
            
            
       
            
SELECT 
    cd.companyid, cd.companyname, con.contact, cd.companyshortname,
    cd.address, cd.zipcode, cd.active, co.country, st.state, ci.city,
    cd.establish_date, cd.REVENUE,
    COUNT(*) OVER() AS total_records
FROM 
    companydetail cd
JOIN 
    countrydetail co ON co.cid = cd.cid
JOIN 
    statedetail st ON st.sid = cd.sid
JOIN 
    citydetail ci ON ci.cityid = cd.cityid
JOIN 
    contactdetail con ON con.contactid = cd.contactid
WHERE lower(country) like lower('%ind%')
and
lower(state) like lower('%tam%')
   
    AND 
    co.cid IN (2000) 
    AND 
    st.sid IN (3000, 3001, 3002) 
    AND 
    ci.cityid IN (4000, 4001, 4002, 4003)
ORDER BY 
    companyid asc;
            
            
            
            
            
            
            


            
            
            
CREATE OR REPLACE PACKAGE state_package AS
  PROCEDURE get_states_by_countries(ids IN sys.odcinumberlist, states_cursor OUT SYS_REFCURSOR);
END state_package;

CREATE OR REPLACE PACKAGE BODY state_package AS
  PROCEDURE get_states_by_countries(ids IN sys.odcinumberlist, states_cursor OUT SYS_REFCURSOR) IS
  BEGIN
    OPEN states_cursor FOR
      SELECT s.state, s.sid, s.cid
      FROM statedetail s
      JOIN countrydetail c ON s.cid = c.cid
      WHERE c.cid IN (SELECT column_value FROM TABLE(ids));
  END get_states_by_countries;
END state_package;



select * from contactdetail



INSERT INTO contactdetail (contact) VALUES ('6382828596');


INSERT INTO companydetail (
    companyname,
    companyshortname,
    address,
    zipcode,
    active,
    contactid,
    cid,
    sid,
    cityid,
    revenue
) VALUES (
    'Demo Company',
    'Demo Co',
    '123 demo Street',
    636203,
    'yes',
    (SELECT contactid FROM contactdetail WHERE contact = "6382828596"),
    2004,
    3010,
    4014,
    32533.89
);




DECLARE
    v_contactid contactdetail.contactid%TYPE;
BEGIN
    SELECT contactid INTO v_contactid FROM contactdetail WHERE contact = '6382828596';
    
    -- Insert into companydetail table using the retrieved contactid
    INSERT INTO companydetail (
        companyname,
        companyshortname,
        address,
        zipcode,
        active,
        contactid,
        cid,
        sid,
        cityid,
        revenue
    ) VALUES (
        'Demo Company',
        'Demo Co',
        '123 demo Street',
        636203,
        'yes',
        v_contactid,
        2004,
        3010,
        4014,
        32533.89
    );
END;
/

            
            ----------------------------------------------------------------------------------------------------------------------
            
CREATE OR REPLACE PACKAGE company_management AS
    PROCEDURE insert_company_detail (
        p_contact IN VARCHAR2,
        p_companyname IN VARCHAR2,
        p_companyshortname IN VARCHAR2,
        p_address IN VARCHAR2,
        p_zipcode IN NUMBER,
        p_active IN VARCHAR2,
        p_cid IN NUMBER,
        p_sid IN NUMBER,
        p_cityid IN NUMBER,
        p_revenue IN NUMBER
    );
END company_management;
/

CREATE OR REPLACE PACKAGE BODY company_management AS
    PROCEDURE insert_company_detail (
        p_contact IN VARCHAR2,
        p_companyname IN VARCHAR2,
        p_companyshortname IN VARCHAR2,
        p_address IN VARCHAR2,
        p_zipcode IN NUMBER,
        p_active IN VARCHAR2,
        p_cid IN NUMBER,
        p_sid IN NUMBER,
        p_cityid IN NUMBER,
        p_revenue IN NUMBER
    ) IS
        v_contactid contactdetail.contactid%TYPE;
    BEGIN
        -- Insert into contactdetail table
        INSERT INTO contactdetail (contact) VALUES (p_contact);
        
        -- Retrieve the contactid using a SELECT statement
        SELECT contactid INTO v_contactid FROM contactdetail WHERE contact = p_contact;
        
        -- Insert into companydetail table using the retrieved contactid
        INSERT INTO companydetail (
            companyname,
            companyshortname,
            address,
            zipcode,
            active,
            contactid,
            cid,
            sid,
            cityid,
            revenue
        ) VALUES (
            p_companyname,
            p_companyshortname,
            p_address,
            p_zipcode,
            p_active,
            v_contactid,
            p_cid,
            p_sid,
            p_cityid,
            p_revenue
        );
    END insert_company_detail;
END company_management;
/

            
       select * from companydetail     
       
       select * from contactdetail
            
            delete from contactdetail where contactid= 1021
            delete from contactdetail where contactid= 1042
            delete from contactdetail where contactid= 1045
            delete from contactdetail where contactid= 1046
            delete from contactdetail where contactid= 1047
            delete from contactdetail where contactid= 1048
            
            CREATE OR REPLACE TYPE INT_ARRAY AS TABLE OF NUMBER;

            
CREATE OR REPLACE PACKAGE FilterPackage AS
    PROCEDURE GetStatesByCountries(ids IN INT_ARRAY, statesbyc_cursor OUT SYS_REFCURSOR);
    PROCEDURE GetcitiesByCountries(ids IN INT_ARRAY, citiesbyc_cursor OUT SYS_REFCURSOR);
    PROCEDURE GetcitiesByState(ids IN INT_ARRAY, citiesbys_cursor OUT SYS_REFCURSOR);
END FilterPackage;
/

CREATE OR REPLACE PACKAGE BODY FilterPackage AS
    PROCEDURE GetStatesByCountries(ids IN INT_ARRAY, statesbyc_cursor OUT SYS_REFCURSOR) IS
    BEGIN
        OPEN statesbyc_cursor FOR
            SELECT s.state, s.sid, s.cid
            FROM statedetail s
            JOIN countrydetail c ON s.cid = c.cid
            WHERE c.cid IN (SELECT COLUMN_VALUE FROM TABLE(ids));
    END GetStatesByCountries;
    
    PROCEDURE GetcitiesByCountries(ids IN INT_ARRAY, citiesbyc_cursor OUT SYS_REFCURSOR) IS
    BEGIN
        OPEN citiesbyc_cursor FOR
            SELECT cit.city, cit.cid, cit.sid, cit.cityid
            FROM citydetail cit
            JOIN countrydetail c ON cit.cid = c.cid
            WHERE c.cid IN (SELECT COLUMN_VALUE FROM TABLE(ids));
    END GetcitiesByCountries;
    
    PROCEDURE GetcitiesByState(ids IN INT_ARRAY, citiesbys_cursor OUT SYS_REFCURSOR) IS
    BEGIN
        OPEN citiesbys_cursor FOR
            SELECT cit.city, cit.cid, cit.sid, cit.cityid
            FROM citydetail cit
            JOIN statedetail s ON cit.sid = s.sid
            WHERE s.sid IN (SELECT COLUMN_VALUE FROM TABLE(ids));
    END GetcitiesByState;
END FilterPackage;
/



