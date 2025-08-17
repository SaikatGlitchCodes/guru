-- Additional Subjects Insert Script
-- This script adds more specialized and niche subjects to complement the popular_subjects_insert.sql
-- Generated: 2025-08-17
-- 
-- Categories: Specialized Technology, Professional Skills, Hobbies, Trades, Advanced Sciences, etc.
-- Note: Ensures no duplication with existing subjects

-- Insert additional specialized subjects
INSERT INTO subjects (name, description, category, difficulty_level, hourly_rate_min, hourly_rate_max, is_active) VALUES

-- ADVANCED PROGRAMMING & TECHNOLOGY
('Assembly Language', 'Low-level programming, CPU architecture, optimization', 'Computer Science', 'advanced', 45, 90, true),
('COBOL Programming', 'Legacy systems, mainframe programming, business applications', 'Computer Science', 'intermediate', 40, 80, true),
('Fortran Programming', 'Scientific computing, numerical analysis, HPC', 'Computer Science', 'intermediate', 35, 75, true),
('LISP Programming', 'Symbolic programming, AI research, functional programming', 'Computer Science', 'advanced', 40, 80, true),
('Prolog Programming', 'Logic programming, expert systems, AI applications', 'Computer Science', 'advanced', 40, 80, true),
('PowerBI', 'Business intelligence, data visualization, reporting', 'Data Science', 'intermediate', 35, 70, true),
('Tableau', 'Data visualization, business analytics, dashboards', 'Data Science', 'intermediate', 35, 75, true),
('QlikView', 'Business intelligence, data discovery, visualization', 'Data Science', 'intermediate', 35, 70, true),
('Splunk', 'Log analysis, IT monitoring, security analytics', 'Data Science', 'intermediate', 40, 80, true),
('SAS Programming', 'Statistical analysis, data mining, business analytics', 'Data Science', 'intermediate', 40, 85, true),
('SPSS', 'Statistical analysis, research methodology, data analysis', 'Data Science', 'intermediate', 30, 70, true),
('Stata', 'Statistical software, econometrics, research analysis', 'Data Science', 'intermediate', 35, 75, true),
('Apache Kafka', 'Stream processing, real-time data, distributed systems', 'Data Science', 'advanced', 45, 90, true),
('Apache Airflow', 'Workflow orchestration, data pipelines, scheduling', 'Data Science', 'advanced', 40, 80, true),
('Apache NiFi', 'Data flow automation, ETL processes, data integration', 'Data Science', 'advanced', 40, 80, true),
('Snowflake', 'Cloud data warehouse, data analytics, SQL', 'Database', 'intermediate', 40, 80, true),
('dbt', 'Data transformation, analytics engineering, SQL', 'Database', 'intermediate', 35, 75, true),
('Databricks', 'Unified analytics, Apache Spark, machine learning', 'Data Science', 'advanced', 45, 90, true),
('MLflow', 'Machine learning lifecycle, model management', 'Data Science', 'advanced', 40, 85, true),
('Kubeflow', 'Machine learning on Kubernetes, ML pipelines', 'Data Science', 'advanced', 50, 95, true),

-- CLOUD & INFRASTRUCTURE SPECIALIZATIONS
('Serverless Computing', 'AWS Lambda, Azure Functions, event-driven architecture', 'Cloud Computing', 'intermediate', 40, 80, true),
('Infrastructure as Code', 'CloudFormation, ARM templates, automation', 'DevOps', 'advanced', 40, 85, true),
('CDN Configuration', 'Content delivery networks, edge computing, performance', 'DevOps', 'intermediate', 35, 70, true),
('Load Balancing', 'Traffic distribution, high availability, scaling', 'DevOps', 'intermediate', 35, 70, true),
('Monitoring & Observability', 'Prometheus, Grafana, application monitoring', 'DevOps', 'intermediate', 35, 75, true),
('Log Management', 'ELK Stack, centralized logging, troubleshooting', 'DevOps', 'intermediate', 35, 70, true),
('Backup & Disaster Recovery', 'Data protection, business continuity, planning', 'System Administration', 'intermediate', 35, 70, true),
('High Availability Systems', 'Fault tolerance, redundancy, system design', 'System Administration', 'advanced', 40, 80, true),
('Network Administration', 'Routing, switching, network protocols, troubleshooting', 'System Administration', 'intermediate', 35, 70, true),
('Firewall Configuration', 'Network security, packet filtering, access control', 'Cybersecurity', 'intermediate', 35, 75, true),
('VPN Setup', 'Virtual private networks, secure connections, tunneling', 'Cybersecurity', 'intermediate', 30, 65, true),
('DNS Management', 'Domain name system, DNS records, troubleshooting', 'System Administration', 'intermediate', 30, 65, true),

-- EMERGING TECHNOLOGIES
('Artificial Intelligence', 'AI concepts, machine learning, neural networks', 'Data Science', 'advanced', 50, 100, true),
('Quantum Computing', 'Quantum algorithms, quantum mechanics, Qiskit', 'Computer Science', 'advanced', 60, 120, true),
('Edge Computing', 'Distributed computing, IoT, low-latency processing', 'Computer Science', 'advanced', 45, 90, true),
('Augmented Reality', 'AR development, mixed reality, spatial computing', 'Computer Science', 'advanced', 45, 90, true),
('Virtual Reality', 'VR development, immersive experiences, 3D environments', 'Computer Science', 'advanced', 45, 90, true),
('Mixed Reality', 'MR development, holographic computing, spatial mapping', 'Computer Science', 'advanced', 50, 95, true),
('5G Technology', 'Next generation wireless, network slicing, edge computing', 'Technology', 'advanced', 45, 90, true),
('Autonomous Vehicles', 'Self-driving cars, sensor fusion, path planning', 'Engineering', 'advanced', 55, 110, true),
('Drone Technology', 'UAV programming, flight control, aerial systems', 'Engineering', 'intermediate', 35, 75, true),
('3D Printing', 'Additive manufacturing, CAD design, materials', 'Engineering', 'intermediate', 30, 65, true),
('Bioinformatics', 'Computational biology, genomics, protein analysis', 'Science', 'advanced', 45, 90, true),
('Computational Biology', 'Mathematical modeling, biological systems', 'Science', 'advanced', 45, 90, true),

-- PROFESSIONAL SOFTWARE & TOOLS
('AutoCAD', '2D/3D CAD design, technical drawing, engineering', 'Design', 'intermediate', 35, 70, true),
('SolidWorks', '3D mechanical design, simulation, engineering', 'Design', 'intermediate', 40, 80, true),
('CATIA', 'Advanced CAD, product design, aerospace engineering', 'Design', 'advanced', 45, 90, true),
('Revit', 'Building Information Modeling, architecture, construction', 'Design', 'intermediate', 35, 75, true),
('SketchUp', '3D modeling, architectural visualization, design', 'Design', 'beginner', 25, 55, true),
('Blender', '3D modeling, animation, rendering, open source', 'Design', 'intermediate', 30, 65, true),
('Maya', '3D animation, modeling, visual effects, film', 'Design', 'advanced', 40, 85, true),
('3ds Max', '3D modeling, animation, architectural visualization', 'Design', 'advanced', 40, 85, true),
('Cinema 4D', '3D motion graphics, animation, visual effects', 'Design', 'advanced', 40, 85, true),
('ZBrush', 'Digital sculpting, character modeling, texturing', 'Design', 'advanced', 40, 85, true),
('Adobe After Effects', 'Motion graphics, visual effects, compositing', 'Design', 'intermediate', 35, 75, true),
('Adobe Premiere Pro', 'Video editing, post-production, media workflows', 'Design', 'intermediate', 30, 70, true),
('Final Cut Pro', 'Video editing, post-production, Mac ecosystem', 'Design', 'intermediate', 30, 70, true),
('DaVinci Resolve', 'Video editing, color grading, post-production', 'Design', 'intermediate', 35, 75, true),
('Logic Pro', 'Music production, recording, MIDI sequencing', 'Arts', 'intermediate', 35, 75, true),
('Pro Tools', 'Professional audio recording, mixing, mastering', 'Arts', 'intermediate', 40, 80, true),
('Ableton Live', 'Music production, live performance, electronic music', 'Arts', 'intermediate', 35, 75, true),
('FL Studio', 'Digital audio workstation, beat making, production', 'Arts', 'intermediate', 30, 65, true),

-- SPECIALIZED DATABASES & DATA TECHNOLOGIES
('Apache Cassandra', 'Distributed NoSQL database, big data, scalability', 'Database', 'advanced', 40, 85, true),
('Apache CouchDB', 'Document database, JSON storage, replication', 'Database', 'intermediate', 30, 65, true),
('RavenDB', 'Document database, .NET integration, ACID transactions', 'Database', 'intermediate', 35, 70, true),
('OrientDB', 'Multi-model database, graph and document storage', 'Database', 'intermediate', 35, 70, true),
('ArangoDB', 'Multi-model database, graph, document, key-value', 'Database', 'intermediate', 35, 70, true),
('TimeScale DB', 'Time-series database, PostgreSQL extension', 'Database', 'intermediate', 35, 70, true),
('ClickHouse', 'Columnar database, analytics, real-time queries', 'Database', 'advanced', 40, 80, true),
('Amazon Aurora', 'Cloud-native database, MySQL/PostgreSQL compatible', 'Database', 'intermediate', 35, 75, true),
('Google BigQuery', 'Data warehouse, analytics, SQL queries', 'Database', 'intermediate', 35, 75, true),
('Azure Cosmos DB', 'Multi-model database, global distribution', 'Database', 'intermediate', 35, 75, true),

-- SPECIALIZED PROGRAMMING FRAMEWORKS
('Electron', 'Cross-platform desktop apps, JavaScript, HTML, CSS', 'JavaScript', 'intermediate', 30, 70, true),
('Tauri', 'Rust-based desktop applications, web technologies', 'Computer Science', 'intermediate', 35, 75, true),
('Qt', 'Cross-platform application framework, C++, Python', 'Computer Science', 'intermediate', 35, 75, true),
('GTK', 'GUI toolkit, Linux applications, C/Python', 'Computer Science', 'intermediate', 30, 65, true),
('WPF', 'Windows Presentation Foundation, .NET, XAML', 'Computer Science', 'intermediate', 30, 70, true),
('WinUI', 'Windows UI framework, modern Windows apps', 'Computer Science', 'intermediate', 30, 70, true),
('Xamarin.Forms', 'Cross-platform mobile UI, C#, .NET', 'Mobile Development', 'intermediate', 35, 75, true),
('Apache Cordova', 'Hybrid mobile apps, web technologies', 'Mobile Development', 'intermediate', 25, 60, true),
('PWA Development', 'Progressive Web Apps, service workers, offline', 'Web Development', 'intermediate', 30, 65, true),
('WebAssembly', 'High-performance web applications, binary format', 'Web Development', 'advanced', 40, 80, true),

-- TRADING & FINANCE TECHNOLOGIES
('Algorithmic Trading', 'Automated trading, quantitative analysis, strategies', 'Finance', 'advanced', 60, 120, true),
('Financial Modeling', 'Valuation models, financial analysis, Excel/Python', 'Finance', 'advanced', 45, 95, true),
('Quantitative Analysis', 'Mathematical finance, risk modeling, derivatives', 'Finance', 'advanced', 50, 100, true),
('Cryptocurrency Trading', 'Digital assets, blockchain, trading strategies', 'Finance', 'intermediate', 40, 85, true),
('Options Trading', 'Derivatives, risk management, strategies', 'Finance', 'advanced', 45, 90, true),
('Forex Trading', 'Foreign exchange, currency pairs, technical analysis', 'Finance', 'intermediate', 35, 75, true),
('Bloomberg Terminal', 'Financial data, analysis tools, market information', 'Finance', 'intermediate', 40, 80, true),
('MetaTrader', 'Trading platform, technical analysis, automated trading', 'Finance', 'intermediate', 30, 65, true),
('TradingView', 'Charting platform, technical analysis, social trading', 'Finance', 'beginner', 25, 55, true),

-- CREATIVE INDUSTRIES
('Game Art', '2D/3D game assets, character design, environments', 'Game Development', 'intermediate', 35, 75, true),
('Level Design', 'Game environments, player experience, flow', 'Game Development', 'intermediate', 35, 70, true),
('Game Audio', 'Sound effects, music, audio implementation', 'Game Development', 'intermediate', 30, 65, true),
('Narrative Design', 'Storytelling, dialogue, interactive fiction', 'Game Development', 'intermediate', 30, 65, true),
('UI/UX for Games', 'User interface design, player experience', 'Game Development', 'intermediate', 35, 70, true),
('VFX for Film', 'Visual effects, compositing, motion graphics', 'Arts', 'advanced', 45, 90, true),
('Color Grading', 'Post-production, color correction, visual style', 'Arts', 'intermediate', 35, 75, true),
('Motion Capture', 'Performance capture, 3D animation, technology', 'Arts', 'advanced', 40, 80, true),
('Concept Art', 'Visual development, character/environment design', 'Arts', 'intermediate', 30, 70, true),
('Storyboarding', 'Visual storytelling, film/animation pre-production', 'Arts', 'intermediate', 30, 65, true),
('Comic Book Creation', 'Sequential art, storytelling, illustration', 'Arts', 'intermediate', 25, 60, true),
('Manga/Anime Art', 'Japanese art styles, character design, storytelling', 'Arts', 'intermediate', 25, 60, true),

-- SPECIALIZED BUSINESS & MARKETING
('Affiliate Marketing', 'Performance marketing, commission-based sales', 'Business', 'intermediate', 30, 65, true),
('Influencer Marketing', 'Social media marketing, brand partnerships', 'Business', 'intermediate', 30, 65, true),
('Content Marketing', 'Content strategy, storytelling, audience engagement', 'Business', 'intermediate', 30, 65, true),
('Email Marketing', 'Campaign design, automation, customer retention', 'Business', 'intermediate', 25, 60, true),
('SEO/SEM', 'Search engine optimization, marketing, analytics', 'Business', 'intermediate', 30, 70, true),
('Google Analytics', 'Web analytics, data interpretation, insights', 'Business', 'intermediate', 25, 60, true),
('Google Ads', 'Pay-per-click advertising, campaign management', 'Business', 'intermediate', 30, 65, true),
('Facebook Ads', 'Social media advertising, targeting, optimization', 'Business', 'intermediate', 25, 60, true),
('LinkedIn Marketing', 'B2B marketing, professional networking, lead generation', 'Business', 'intermediate', 30, 65, true),
('Amazon FBA', 'Fulfillment by Amazon, e-commerce, product sourcing', 'Business', 'intermediate', 35, 70, true),
('Dropshipping', 'E-commerce model, supplier management, marketing', 'Business', 'intermediate', 25, 60, true),
('Shopify Development', 'E-commerce platform, store customization, apps', 'Business', 'intermediate', 30, 65, true),
('WooCommerce', 'WordPress e-commerce, online store development', 'Business', 'intermediate', 25, 60, true),
('Magento', 'E-commerce platform, enterprise solutions', 'Business', 'intermediate', 35, 70, true),

-- HEALTHCARE & MEDICAL SPECIALIZATIONS
('Medical Imaging', 'Radiology, CT, MRI, ultrasound interpretation', 'Medical Science', 'advanced', 50, 100, true),
('Telemedicine', 'Remote healthcare, digital health platforms', 'Medical Science', 'intermediate', 35, 75, true),
('Health Informatics', 'Healthcare data, electronic records, systems', 'Medical Science', 'advanced', 40, 80, true),
('Biostatistics', 'Statistical methods in biology and medicine', 'Medical Science', 'advanced', 40, 85, true),
('Clinical Research', 'Medical trials, research methodology, regulation', 'Medical Science', 'advanced', 40, 85, true),
('Epidemiology', 'Disease patterns, public health, statistical analysis', 'Medical Science', 'advanced', 40, 80, true),
('Medical Device Design', 'Biomedical engineering, FDA regulations, testing', 'Medical Science', 'advanced', 45, 90, true),
('Pharmaceutical Sciences', 'Drug development, pharmacokinetics, regulation', 'Medical Science', 'advanced', 45, 90, true),
('Medical Coding', 'ICD-10, CPT codes, healthcare billing', 'Medical Science', 'intermediate', 25, 60, true),
('Healthcare Administration', 'Hospital management, healthcare policy, operations', 'Medical Science', 'intermediate', 35, 70, true),

-- TRADES & VOCATIONAL SKILLS
('Electrical Work', 'Wiring, circuits, electrical codes, safety', 'Trade Skills', 'intermediate', 35, 75, true),
('Plumbing', 'Pipe systems, water flow, installation, repair', 'Trade Skills', 'intermediate', 30, 70, true),
('HVAC Systems', 'Heating, ventilation, air conditioning, maintenance', 'Trade Skills', 'intermediate', 35, 75, true),
('Carpentry', 'Woodworking, construction, furniture making', 'Trade Skills', 'intermediate', 25, 65, true),
('Welding', 'Metal joining, fabrication, safety procedures', 'Trade Skills', 'intermediate', 30, 70, true),
('Auto Mechanics', 'Vehicle repair, diagnostics, maintenance', 'Trade Skills', 'intermediate', 30, 65, true),
('Locksmithing', 'Lock installation, key cutting, security systems', 'Trade Skills', 'intermediate', 30, 65, true),
('Landscaping', 'Garden design, plant care, outdoor spaces', 'Trade Skills', 'beginner', 20, 50, true),
('Masonry', 'Brickwork, stonework, concrete, construction', 'Trade Skills', 'intermediate', 30, 65, true),
('Roofing', 'Roof installation, repair, waterproofing', 'Trade Skills', 'intermediate', 30, 65, true),

-- HOBBIES & LIFESTYLE
('Cooking', 'Culinary skills, recipes, food preparation techniques', 'Lifestyle', 'beginner', 20, 50, true),
('Baking', 'Pastry, bread making, desserts, techniques', 'Lifestyle', 'beginner', 20, 50, true),
('Wine Tasting', 'Wine appreciation, pairing, sommelier skills', 'Lifestyle', 'intermediate', 30, 65, true),
('Coffee Brewing', 'Espresso, brewing methods, coffee appreciation', 'Lifestyle', 'beginner', 20, 45, true),
('Gardening', 'Plant care, landscaping, sustainable growing', 'Lifestyle', 'beginner', 15, 40, true),
('Home Brewing', 'Beer making, fermentation, recipe development', 'Lifestyle', 'intermediate', 25, 55, true),
('Woodworking', 'Furniture making, craftsmanship, tool usage', 'Lifestyle', 'intermediate', 25, 60, true),
('Pottery', 'Ceramics, wheel throwing, glazing techniques', 'Lifestyle', 'beginner', 20, 50, true),
('Jewelry Making', 'Metalworking, gem setting, design', 'Lifestyle', 'intermediate', 25, 60, true),
('Leatherworking', 'Leather crafting, tooling, accessory making', 'Lifestyle', 'intermediate', 25, 55, true),
('Knitting', 'Yarn crafts, pattern reading, garment construction', 'Lifestyle', 'beginner', 15, 40, true),
('Sewing', 'Garment construction, alterations, pattern making', 'Lifestyle', 'beginner', 20, 45, true),
('Quilting', 'Fabric arts, pattern design, hand/machine quilting', 'Lifestyle', 'intermediate', 20, 50, true),
('Calligraphy', 'Hand lettering, typography, artistic writing', 'Arts', 'beginner', 20, 50, true),
('Origami', 'Paper folding, Japanese art, geometric designs', 'Arts', 'beginner', 15, 40, true),
('Magic Tricks', 'Sleight of hand, performance, entertainment', 'Arts', 'beginner', 20, 50, true),
('Stand-up Comedy', 'Comedy writing, performance, timing', 'Arts', 'intermediate', 25, 60, true),
('Improv Comedy', 'Improvisational theater, spontaneous performance', 'Arts', 'intermediate', 25, 60, true),

-- SPECIALIZED SCIENCES
('Forensic Science', 'Crime scene investigation, evidence analysis', 'Science', 'advanced', 40, 85, true),
('Archeology', 'Historical excavation, artifact analysis, dating', 'Science', 'intermediate', 30, 65, true),
('Anthropology', 'Human culture, evolution, social structures', 'Science', 'intermediate', 25, 60, true),
('Paleontology', 'Fossil study, prehistoric life, geological time', 'Science', 'intermediate', 30, 65, true),
('Meteorology', 'Weather patterns, atmospheric science, forecasting', 'Science', 'intermediate', 30, 65, true),
('Seismology', 'Earthquake study, geological monitoring, analysis', 'Science', 'advanced', 35, 75, true),
('Volcanology', 'Volcano study, eruption prediction, hazard assessment', 'Science', 'advanced', 35, 75, true),
('Hydrology', 'Water systems, watershed management, conservation', 'Science', 'intermediate', 30, 65, true),
('Soil Science', 'Soil composition, agriculture, environmental impact', 'Science', 'intermediate', 25, 60, true),
('Remote Sensing', 'Satellite imagery, GIS, environmental monitoring', 'Science', 'intermediate', 35, 70, true),
('Cartography', 'Map making, geographic visualization, GIS', 'Science', 'intermediate', 30, 65, true),
('Surveying', 'Land measurement, mapping, construction layout', 'Science', 'intermediate', 30, 65, true);

-- Update the created_at and updated_at timestamps
UPDATE subjects SET 
    created_at = NOW(),
    updated_at = NOW()
WHERE created_at IS NULL OR updated_at IS NULL;
