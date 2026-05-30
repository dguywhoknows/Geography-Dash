/**
 * Geography Dash — city liveability data (stage order: strongest factor first → boss synthesizes weakest themes).
 * Ratings and ordering reflect the designer brief; sources listed in GEOGRAPHY_DASH.citations.
 */
window.GEOGRAPHY_DASH = {
  citations: [], // populated by js/citations.js
  controls:
    "Run: ← → or A D · Jump: Space, W, or ↑ · Hazards kill — respawn at checkpoint or city start · Each stage has its own rest hub (Hub button) · E at plaques in hubs · Esc: pause / leave hub · Citations: header button",
  cities: [
    {
      id: "copenhagen",
      name: "Copenhagen",
      liveability: "Very Liveable",
      difficulty: 0.28,
      accent: "#6ec8ff",
      skyTop: "#87ceeb",
      skyBot: "#c8e8f8",
      blurb:
        "Bikes, canals, and wind — a gentle course that still asks you to respect winter and housing pressure in the finale.",
      stages: [
        stage("Environment", "5/5", "Clean air, renewable energy, bike infrastructure", "Expensive environmental policies", "env", "wind_turbine"),
        stage("Getting Around", "5/5", "Excellent cycling and transit", "Winters are hard on cycling", "mobility", "bike_lane"),
        stage("Safety", "5/5", "Very low crime", "Mild pickpocketing in tourist pockets", "safety", "patrol_soft"),
        stage("Health", "5/5", "Universal healthcare, strong hospitals", "Wait times for some specialized care", "health", "pulse_zone"),
        stage("Civic Engagement", "5/5", "High turnout, strong trust", "Tax burden can sour attitudes", "civic", "ballot_wave"),
        stage("State of the Sector", "5/5", "Strong public institutions", "Cost of maintaining welfare", "sector", "institution_gate"),
        stage("Income and Wealth", "5/5", "High income, low inequality", "High taxation", "income", "tax_slider"),
        stage("Learning", "5/5", "Great schools and universities", "Competitive academics", "learning", "book_stack"),
        stage("Work", "4/5", "High wages, work-life balance", "Labour cost and taxes", "work", "commute_pulse"),
        stage("Arts, Culture & Recreation", "4/5", "Museums, parks, festivals", "Smaller scene than megacities", "arts", "stage_hazard"),
        boss("Housing squeeze", "3/5", "Quality housing and supports", "Very expensive housing", "housing", "boss_tower"),
      ],
      hubObjects: [
        hub("Nyhavn facades", "Colourful harbourfront housing shows how dense, human-scale blocks can stay walkable when car space is traded for people space."),
        hub("Wind turbine (Øresund view)", "Denmark’s offshore wind ties clean power to planning — good liveability needs affordable electrons, not just pretty skylines."),
        hub("Cycle superhighway", "Separated bike routes reduce injuries and noise stress; they are infrastructure for daily life, not only recreation."),
        hub("Harbour bath", "Clean enough to swim in — a public health and environment win that comes from strict wastewater and harbour management."),
      ],
    },
    {
      id: "toronto",
      name: "Toronto",
      liveability: "Quite Liveable",
      difficulty: 0.45,
      accent: "#ff6b4a",
      skyTop: "#4a6fa5",
      skyBot: "#f0d8c8",
      blurb:
        "CN towers of opportunity — arts shine early, but sprawl, congestion, and the affordability crunch bite harder in later stages.",
      stages: [
        stage("Arts, Culture & Recreation", "5/5", "Food, arts, sports, festivals", "Cost of attending", "arts", "stage_hazard"),
        stage("Learning", "4/5", "Major universities, strong schools", "Neighbourhood inequality", "learning", "book_stack"),
        stage("Work", "4/5", "Finance and tech strength", "Competition and burnout", "work", "commute_pulse"),
        stage("Civic Engagement", "4/5", "Diverse civic orgs", "Lower municipal turnout vs Nordic peers", "civic", "ballot_wave"),
        stage("Health", "4/5", "Strong hospitals, universal care", "Wait times, strained system", "health", "pulse_zone"),
        stage("Safety", "4/5", "Relatively safe megacity", "Auto theft, housing-linked crime", "safety", "car_swarm"),
        stage("State of the Sector", "4/5", "Stable government", "Infrastructure lags growth", "sector", "institution_gate"),
        stage("Income and Wealth", "4/5", "Solid salaries", "Wealth gap, high living costs", "income", "tax_slider"),
        stage("Environment", "3/5", "Parks, improving sustainability", "Traffic pollution, sprawl", "env", "smog_cloud"),
        stage("Getting Around", "3/5", "Expanding transit", "Congestion, delays, funding gaps", "mobility", "car_swarm"),
        boss("Housing & sprawl boss", "2/5", "Most homes are decent quality", "Severe affordability crisis", "housing", "boss_sprawl"),
      ],
      hubObjects: [
        hub("CN Tower silhouette", "Landmark density can fund transit and culture — but icon projects shouldn’t distract from everyday affordability."),
        hub("Streetcar wire", "Surface transit builds neighbourhoods; delays show when road space still prioritizes solo cars."),
        hub("Lake Ontario shoreline", "Blue space improves mental health — access should be equitable, not only for lakefront condos."),
        hub("Ravine trailhead", "Green corridors fight heat islands; protecting them is climate and liveability policy together."),
      ],
    },
    {
      id: "istanbul",
      name: "Istanbul",
      liveability: "Barely Liveable",
      difficulty: 0.62,
      accent: "#d4a574",
      skyTop: "#6b5344",
      skyBot: "#e8c9a0",
      blurb:
        "Bosphorus brilliance with ferries and history — volatility, quake risk, and density sharpen hazards as you descend the list.",
      stages: [
        stage("Arts, Culture & Recreation", "5/5", "History, nightlife, cuisine", "Crowded attractions", "arts", "stage_hazard"),
        stage("Civic Engagement", "3/5", "Neighbourhood identity", "Polarization", "civic", "ballot_wave"),
        stage("Learning", "3/5", "Historic universities", "Uneven school quality", "learning", "book_stack"),
        stage("Getting Around", "3/5", "Ferries, metro expansion", "Heavy traffic", "mobility", "car_swarm"),
        stage("Housing", "3/5", "More affordable than many Western cities", "Earthquake vulnerability, aging stock", "housing", "quake_crack"),
        stage("Work", "3/5", "Commerce and tourism", "Inflation, instability", "work", "commute_pulse"),
        stage("Health", "3/5", "Large network, medical tourism", "Healthcare inequality", "health", "pulse_zone"),
        stage("Safety", "3/5", "Safer than many megacities", "Geopolitical stress periods", "safety", "patrol_soft"),
        stage("State of the Sector", "3/5", "Tourism and business", "Government and economic uncertainty", "sector", "institution_gate"),
        stage("Environment", "2/5", "Coastline, green pockets", "Pollution, density", "env", "smog_cloud"),
        boss("Currency & mobility boss", "2/5", "Large economic centre", "Currency swings hit incomes", "income", "boss_volatile"),
      ],
      hubObjects: [
        hub("Galata stone", "Galata’s dense urban grain supports walkable commerce — stone walls also remind us quake retrofitting is liveability infrastructure."),
        hub("Ferry wake", "Water buses move millions; they fight congestion if docks and schedules stay integrated with rail."),
        hub("Bosphorus bridge span", "Mega-links reshape commutes — who benefits depends on tolls, land value capture, and tenant protections."),
        hub("Tile kiosk", "Small commerce keeps streets alive; informal workers need safe public space and predictable regulation."),
      ],
    },
    {
      id: "bangkok",
      name: "Bangkok",
      liveability: "Slightly Unliveable",
      difficulty: 0.72,
      accent: "#9b59b6",
      skyTop: "#2c1e4a",
      skyBot: "#ffd59a",
      blurb:
        "Temples and skytrain sparks — later stages flood with haze, traffic, and political uncertainty in the hazards.",
      stages: [
        stage("Arts, Culture & Recreation", "5/5", "Temples, food, nightlife", "Tourist overcrowding", "arts", "stage_hazard"),
        stage("Housing", "4/5", "Affordable condos vs West", "Flood-prone districts", "housing", "flood_zone"),
        stage("Income and Wealth", "3/5", "Lower cost of living", "Inequality, capital leakage", "income", "tax_slider"),
        stage("Work", "3/5", "Tourism and business hub", "Wage inequality", "work", "commute_pulse"),
        stage("Health", "3/5", "Strong private hospitals", "Public healthcare gaps", "health", "pulse_zone"),
        stage("Learning", "3/5", "Universities growing", "Rural-urban education gaps", "learning", "book_stack"),
        stage("Civic Engagement", "3/5", "Volunteering culture", "Political instability chills participation", "civic", "ballot_wave"),
        stage("State of the Sector", "3/5", "Tourism infrastructure", "Long-term planning risk", "sector", "institution_gate"),
        stage("Safety", "3/5", "Tourist safety OK", "Road danger", "safety", "car_swarm"),
        stage("Getting Around", "3/5", "Skytrain and metro improve mobility", "World-class traffic jams", "mobility", "car_swarm"),
        boss("Haze & flood boss", "2/5", "Canals and parks exist", "Air pollution and flood risk", "env", "boss_storm"),
      ],
      hubObjects: [
        hub("Skytrain viaduct", "Elevated rail unlocks dense corridors — last-mile safety and fare equity decide who it serves."),
        hub("Canal longtail", "Waterways are mobility and drainage — clearing encroachments without evicting residents needs careful policy."),
        hub("Temple roofline", "Culture anchors neighbourhoods; preserving heritage alongside vertical growth is a planning puzzle."),
        hub("Night market awning", "Street economies cut food miles and social isolation — they need clean power and safe stalls."),
      ],
    },
    {
      id: "newdelhi",
      name: "New Delhi",
      liveability: "Unliveable",
      difficulty: 0.82,
      accent: "#e67e22",
      skyTop: "#5c2a00",
      skyBot: "#ffb366",
      blurb:
        "Heritage and hustle — particulate smog, gridlock, and institutional strain turn the late stages into a gauntlet.",
      stages: [
        stage("Arts, Culture & Recreation", "4/5", "Landmarks and heritage", "Crowding at monuments", "arts", "stage_hazard"),
        stage("Learning", "3/5", "STEM strength", "Unequal access", "learning", "book_stack"),
        stage("Work", "3/5", "Tech and business scale", "Informality, unemployment stress", "work", "commute_pulse"),
        stage("Civic Engagement", "2/5", "Activist networks", "Bureaucracy, corruption drag", "civic", "ballot_wave"),
        stage("Health", "2/5", "Expert hospitals", "Public system strain", "health", "pulse_zone"),
        stage("State of the Sector", "2/5", "Rapid infrastructure", "Overstretched services", "sector", "institution_gate"),
        stage("Income and Wealth", "2/5", "Fast growth", "Deep inequality", "income", "tax_slider"),
        stage("Getting Around", "2/5", "Metro expansion", "Extreme congestion", "mobility", "car_swarm"),
        stage("Housing", "2/5", "Many options", "Uneven quality and tenure security", "housing", "flood_zone"),
        stage("Safety", "2/5", "Visible policing", "Crime and gender safety concerns", "safety", "patrol_hard"),
        boss("Smog megaboss", "1/5", "Some green projects", "Pollution and infrastructure stress", "env", "boss_storm"),
      ],
      hubObjects: [
        hub("Metro pillar art", "Public art in stations can orient riders — wayfinding is accessibility for newcomers and low-literacy riders."),
        hub("Heritage stepwell", "Water heritage shows climate wisdom; reviving blue-green networks fights heat and floods."),
        hub("Street tree planter", "Shade cuts heat exposure for pedestrians — tree cover maps often track income, revealing environmental injustice."),
        hub("E-rickshaw canopy", "Electric last-mile rides cut noise — informal operators need safe charging and fair licensing."),
      ],
    },
    {
      id: "lagos",
      name: "Lagos",
      liveability: "Very Unliveable",
      difficulty: 0.95,
      accent: "#2ecc71",
      skyTop: "#0a1628",
      skyBot: "#1a3d2e",
      blurb:
        "Afrobeats energy and enterprise — extreme inequality, flooding, and gridlock make this the hardest campaign.",
      stages: [
        stage("Arts, Culture & Recreation", "4/5", "Music, film, fashion hub", "Limited public recreation", "arts", "stage_hazard"),
        stage("Work", "2/5", "Major business hub", "Unemployment, informal labour", "work", "commute_pulse"),
        stage("Civic Engagement", "2/5", "Entrepreneurial communities", "Weak institutional trust", "civic", "ballot_wave"),
        stage("Learning", "2/5", "Youth boom, expanding universities", "Underfunded schools", "learning", "book_stack"),
        stage("Income and Wealth", "1/5", "Large fast economy", "Extreme inequality", "income", "tax_slider"),
        stage("State of the Sector", "1/5", "Private sector growth", "Weak public services", "sector", "institution_gate"),
        stage("Health", "1/5", "Private care grows", "Limited access for many", "health", "pulse_zone"),
        stage("Housing", "1/5", "Some lower-cost stock", "Shortages, informal settlements", "housing", "flood_zone"),
        stage("Environment", "1/5", "Coastal potential", "Flooding, waste crises", "env", "smog_cloud"),
        stage("Safety", "1/5", "Strong communities", "Serious security concerns", "safety", "patrol_hard"),
        boss("Gridlock & inequality boss", "1/5", "Transit projects underway", "Severe congestion, unreliable transport", "mobility", "boss_lagos"),
      ],
      hubObjects: [
        hub("Danfo bus colour stripe", "Informal buses fill gaps — formalizing routes without pricing people out needs subsidies and depots."),
        hub("Makoko stilts sketch", "Water communities show adaptive housing — services (waste, power, tenure) must catch up with population."),
        hub("Afrobeats stage rig", "Nightlife economies need sound management and safe venues — culture is work and mental health infrastructure."),
        hub("Mangrove shoreline", "Coastal ecosystems buffer storms; protecting them is flood insurance for the whole metro."),
      ],
    },
  ],
};

function stage(factor, score, strengths, weaknesses, category, hazardTheme) {
  return {
    factor,
    score,
    strengths,
    weaknesses,
    category,
    hazardTheme,
    isBoss: false,
    hubPlaza: {
      title: factor + " — rest plaza",
      text: strengths + " Watch for pressure: " + weaknesses,
    },
  };
}

function boss(factor, score, strengths, weaknesses, category, hazardTheme) {
  return {
    factor,
    score,
    strengths,
    weaknesses,
    category,
    hazardTheme,
    isBoss: true,
    hubPlaza: {
      title: factor + " — finale plaza",
      text: strengths + " This sector concentrates the city's main strain: " + weaknesses,
    },
  };
}

function hub(title, text) {
  return { title, text };
}

// ─── Per-stage hub items ──────────────────────────────────────────────────────
// Each stage gets 4 clickable objects, drawn by kind in the hub level.
// kind → what's drawn; valence "good"/"bad" colours the readout.
(function () {
  function hi(kind, title, body, valence) { return { kind, title, body, valence }; }

  var ITEMS = {
    copenhagen: [
      /* 0 Environment */
      [hi("turbine","Øresund Offshore Wind","Denmark generates ~55% of electricity from wind. The Øresund arrays alone power every Copenhagen household with zero-emission electricity year-round.","good"),
       hi("solar","Rooftop Solar Rollout","10,000+ Copenhagen rooftops have solar panels. Combined with district heating, household carbon footprints rank among the lowest in the OECD.","good"),
       hi("leaf","Urban Green Canopy","33% of Copenhagen's surface is parkland or green space. The city's target: every resident within 300 m of a quality green area.","good"),
       hi("stats","Carbon Neutrality Delay","Copenhagen targeted carbon neutrality by 2025 but fell short. The goal shifted to 2030 — aviation emissions and construction growth proved harder than expected.","bad")],
      /* 1 Getting Around */
      [hi("bike","Cycle Superhighways","62% of Copenhageners cycle to work or school daily — over 390 km of dedicated lanes including 26 inter-city 'cyclesupervejer' separated from all traffic.","good"),
       hi("metro","Metro Cityringen","Opened 2019, the circle line added 17 stations. Trains run every 2 minutes in peak hours, 24 hours a day, seven days a week.","good"),
       hi("ferry","Electric Harbour Buses","Electric harbour buses connect inner-city quays every 12 minutes, carrying 4 million passengers/year — fully integrated into the public transit fare system.","good"),
       hi("drop","Winter Cycling Drop","Cycling rates fall ~15% in winter. Ice, limited daylight, and cold push some riders onto public transit, slightly straining capacity from November to February.","bad")],
      /* 2 Safety */
      [hi("stats","Homicide Rate: <1 per 100k","Copenhagen ranks top 5 safest European cities. Its homicide rate is under 1 per 100,000 — roughly 40× lower than many US cities of comparable size.","good"),
       hi("flag","Community Policing Model","Danish police use a neighbourhood dialogue-first approach. 78% of residents trust law enforcement — social cohesion is treated as the primary crime-reduction tool.","good"),
       hi("house","Nørrebro Gang Pressure","Pockets of gang-related conflict exist in some immigrant-majority suburbs. Government-designated 'parallel society' zones require targeted intervention programmes.","bad"),
       hi("stats","Safe Cities Index: 4.0/5","Copenhagen scores 4.0/5 in the EIU Safe Cities Index 2024, with top marks for personal safety and digital security infrastructure.","good")],
      /* 3 Health */
      [hi("hospital","Universal Healthcare (Sundhedsvæsen)","All Danish residents access publicly funded hospitals and GPs for free at point of use. Denmark spends 10.5% of GDP on health — above the EU average.","good"),
       hi("heart","Life Expectancy: 81.6 Years","Life expectancy ranks among the highest in Europe, driven by diet, cycling culture, clean air, and strong primary care access across all income groups.","good"),
       hi("stats","Specialist Wait Times","Non-emergency specialist wait times can exceed 10 weeks. The government committed €800M to cut waiting lists, but cardiology and orthopaedics remain under strain.","bad"),
       hi("leaf","Youth Mental Health Crisis","Mental health services are underfunded relative to physical care. Youth psychiatric admissions rose 38% from 2015–2023; child and adolescent psychiatry faces critical staff shortages.","bad")],
      /* 4 Civic Engagement */
      [hi("vote","Voter Turnout: 84%","Danish general election turnout consistently exceeds 84% — one of the world's highest. Proportional representation and strong civic education drive participation.","good"),
       hi("flag","Folketing Transparency","The Danish parliament publishes all committee sessions and votes online in real time. Lobbying disclosure rules are among the strictest in Europe.","good"),
       hi("book","Tax Morale & Trust","Denmark has the highest voluntary tax compliance in the OECD. Citizens trust that taxes fund services they personally use — this social contract underpins civic life.","good"),
       hi("stats","Political Polarisation","Immigration policy has sharply divided the spectrum since 2015. Centre parties have shrunk as both far-left and far-right gained seats in the 2022 election.","bad")],
      /* 5 State of the Sector */
      [hi("flag","CPI Rank #1 Globally","Denmark topped the Corruption Perceptions Index 2024 with 90/100. Low corruption reflects strong institutions, press freedom, and vigorous civil society oversight.","good"),
       hi("stats","Flexicurity Welfare Model","The Danish 'flexicurity' model combines easy hiring/firing for employers with 90%-of-prior-wage unemployment benefits for 2 years plus active retraining.","good"),
       hi("dollar","Public Spending: 55% of GDP","Government spending exceeds 55% of GDP — the OECD's highest. Critics argue it crowds out private investment; defenders say it funds world-class services.","bad"),
       hi("house","NemID Digital Government","Every citizen has a digital identity (MitID) for all government services. Denmark ranks #1 in the EU for e-government by European Commission metrics.","good")],
      /* 6 Income and Wealth */
      [hi("dollar","Median Household: €47,000/year","Average Danish households earn €47,000/year after tax — among Europe's highest. The wage floor is set through collective bargaining, not a statutory minimum wage.","good"),
       hi("stats","Gini: 0.29 (Very Equal)","The top 10% earn 6× the bottom 10% — compared to 12× in the US. Denmark has one of the world's most equal income distributions.","good"),
       hi("book","Top Tax Rate: 55.9%","Income above ~€74,000/year is taxed at 55.9% — the OECD's highest. High earners argue this reduces entrepreneurial risk-taking and drives emigration.","bad"),
       hi("house","Concentrated Financial Wealth","While income is broadly distributed, financial wealth (property, stocks) is concentrated: the top 10% hold 64% of net household wealth.","bad")],
      /* 7 Learning */
      [hi("book","PISA Scores Above OECD Average","Denmark consistently beats OECD averages in PISA reading and science. Teaching is built on student autonomy and project-based learning rather than rote memorisation.","good"),
       hi("school","Free University + Stipend","Citizens pay zero tuition at all universities and receive a state living stipend (SU) of up to DKK 6,321/month — keeping student debt among Europe's lowest.","good"),
       hi("stats","Folkeskole Reform Friction","The 2014 school reform added hours but faced teacher resistance. Student wellbeing scores dropped initially, and implementation quality varied significantly across municipalities.","bad"),
       hi("temple","Integration in Schools","Schools in high-immigration districts face Danish-language gaps, resource imbalances, and social segregation. These disparities are a persistent policy challenge.","bad")],
      /* 8 Work */
      [hi("stats","OECD Work-Life Balance: 8.0/10","Denmark scores 8.0/10 on the OECD Better Life Index for work-life balance. Average actual working hours: 1,571/year — 250 hours fewer than the US average.","good"),
       hi("dollar","Average Gross Wage: €56,000","Among the EU's highest, with strong collective bargaining and a tradition of worker representation on corporate boards ('codetermination').","good"),
       hi("factory","Labour Market Flexibility","Flexicurity lets firms dismiss workers more easily than most European peers, keeping labour markets dynamic. Unemployment held at 5.0% in 2024.","good"),
       hi("stats","Burnout & Stress: 30%","Despite high scores, 30% of Danish workers report significant work-related stress. High-performance culture and manager pressure are the primary cited causes.","bad")],
      /* 9 Arts */
      [hi("music","Roskilde Festival","One of Europe's largest music events, run non-profit since 1972. All surplus goes to humanitarian and cultural causes — making culture publicly beneficial by design.","good"),
       hi("theatre","Copenhagen Design Week","Europe's largest design festival, drawing 250,000 visitors. Danish design — Jacobsen chairs, Bang & Olufsen — has lasting global commercial and cultural impact.","good"),
       hi("palette","Danish Arts Council","The Arts Council distributes DKK 620M/year to artists, institutions, and community art at arm's length from government — keeping arts funding politically independent.","good"),
       hi("stats","Cost of Culture","Entry fees and alcohol prices at Copenhagen cultural venues rank among Europe's highest, creating real access barriers for lower-income residents.","bad")],
      /* 10 Boss: Housing */
      [hi("house","Average Apartment: DKK 4.8M","In Copenhagen Municipality, the average apartment exceeded DKK 4.8M (~€640,000) in 2024. Home ownership is impossible for most first-time buyers.","bad"),
       hi("dollar","Rent Burden: 35% of Income","Private sector renters spend on average 35% of net income on rent — above the 30% threshold economists consider the affordability limit.","bad"),
       hi("crane","Social Housing (Almene Boliger)","Denmark's non-profit social housing system houses ~20% of the population. Rents are capped based on construction cost, offering genuine affordability for eligible tenants.","good"),
       hi("stats","30,000-Unit Shortfall by 2030","Copenhagen needs 30,000+ new units by 2030 to meet demand from population growth. Current planning and construction rates fall well short of this target.","bad")],
    ],

    toronto: [
      /* 0 Arts */
      [hi("music","100+ Festivals Annually","Toronto's festival calendar — Afrofest, TIFF, Pride, Caribana — draws 5M+ attendees and generates C$900M for the local economy.","good"),
       hi("theatre","TIFF: World's Largest Public Film Festival","The Toronto International Film Festival screens 250+ films from 60+ countries each September and is the largest publicly attended film festival globally.","good"),
       hi("palette","Art Gallery of Ontario","The AGO holds 120,000 works spanning Indigenous, Canadian, European, and contemporary art. Frank Gehry's expansion made it one of North America's 10 largest art museums.","good"),
       hi("stats","Cost of Attending","TIFF premium screenings cost C$30–50+; AGO adult admission is C$35. For lower-income residents, cultural access is increasingly limited to free community events.","bad")],
      /* 1 Learning */
      [hi("book","UofT — Rank 18 Globally","University of Toronto is Canada's top university and global top 20. It produces more research citations than any other Canadian institution.","good"),
       hi("school","TDSB: 240,000 Students, 115 Languages","The Toronto District School Board is Canada's largest, with an International Language Program teaching 35 languages after school hours.","good"),
       hi("stats","Neighbourhood School Gaps","EQAO scores show wealthy-area schools outperforming lower-income schools by 25–30 percentage points in math. Neighbourhood poverty directly predicts school outcomes.","bad"),
       hi("dollar","Ontario Tuition: C$7,180/year","The highest in Canada. Combined with Toronto living costs, a family can expect C$28,000+/year total — generating significant debt burden for graduates.","bad")],
      /* 2 Work */
      [hi("dollar","Bay Street: 250,000 Finance Jobs","Toronto's financial district contributes more to national GDP per km² than any other Canadian district, employing a quarter-million workers.","good"),
       hi("factory","Tech Sector: +80,000 Jobs 2019–2024","Toronto is one of North America's fastest-growing tech hubs. Google, Amazon, and Microsoft all have major offices in the city.","good"),
       hi("stats","Wage Growth vs Housing: 18% vs 40%","Toronto wages grew 18% from 2019–2024; housing costs grew 40%. Real purchasing power for most workers actually declined over this period.","bad"),
       hi("car","Commute: 54 Minutes Average","Canada's longest average commute. Research links 54-minute daily commutes to burnout, deteriorating health outcomes, and significantly reduced work satisfaction.","bad")],
      /* 3 Civic Engagement */
      [hi("vote","Record Council Diversity 2022","The 2022 election saw 10 new councillors from racialized communities — record representation reflecting Toronto's multicultural makeup in its governance.","good"),
       hi("flag","83 Business Improvement Areas","Over 83 BIAs organise community programming, clean streets, and local advocacy. Strong neighbourhood associations actively shape planning and zoning decisions.","good"),
       hi("stats","Municipal Turnout: 29%","Toronto's 2022 municipal election turnout was just 29% — one of its lowest ever. Low turnout gives disproportionate influence to older, wealthier, homeowning voters.","bad"),
       hi("book","Ward Reduction Controversy","Ontario's mid-election reduction of Toronto City Council from 47 to 25 wards in 2018 was legally challenged. Critics argued it reduced representation in a growing city.","bad")],
      /* 4 Health */
      [hi("hospital","14 Acute Care Hospitals","Toronto's hospital network includes SickKids, UHN, and Sunnybrook — world-class teaching hospitals covered by Canada's single-payer system for all medically necessary care.","good"),
       hi("heart","Life Expectancy: 83 Years","Above the Canadian average of 82.1 — driven by universal healthcare access, diverse diet, and cycling culture among health-conscious residents.","good"),
       hi("stats","ER Wait Times: 6+ Hours","Average non-urgent ER waits exceed 6 hours. Post-COVID staff burnout reduced capacity; many nurses left the profession, and a systematic recovery plan is still ongoing.","bad"),
       hi("leaf","Mental Health: 12,000 on Waitlist","Toronto saw a 45% increase in mental health ER visits 2018–2023. Community mental health services have 12,000-person waiting lists; average counselling wait is 18 months.","bad")],
      /* 5 Safety */
      [hi("stats","Violent Crime: ~1/5 US Peers","Toronto's violent crime rate is roughly one-fifth that of comparable US cities. Strong gun control laws and community policing keep violence relatively low for a city of 3M.","good"),
       hi("flag","Neighbourhood Crime Variation","Scarborough and some northwest areas have violent crime rates 3–4× the downtown core — directly mapping onto income and access-to-services disparities.","bad"),
       hi("car","10,000+ Auto Thefts in 2023","A 25% year-over-year rise. Organised crime rings export stolen vehicles through ports; GPS-jammer technology is frustrating police investigation capacity.","bad"),
       hi("house","Police Budget: C$1.1B","The TPS budget exceeds C$1.1B, yet calls about homelessness, mental health, and addiction increasingly dominate 911 dispatch — straining the conventional policing model.","bad")],
      /* 6 State of the Sector */
      [hi("flag","Federal Transit Funding: C$2.1B","Canada's federal–provincial–municipal structure committed C$2.1B for TTC expansion 2021–2027, supplementing provincial and city contributions for Scarborough and Ontario Line projects.","good"),
       hi("stats","Infrastructure Deficit: C$26B","Toronto's infrastructure gap — needed repairs vs. planned funding — exceeded C$26B in 2023. Aging water mains, transit vehicles, and roads are all systematically under-maintained.","bad"),
       hi("factory","Open Data: Top 10 Globally","Toronto's open data portal offers 500+ datasets. It ranks in the global top 10 for open government data quality by the Open Knowledge Network.","good"),
       hi("dollar","Lowest Property Tax in Ontario","Toronto's property tax rate is the lowest of any large Ontario municipality, starving city services of revenue while demand for housing and transit grows rapidly.","bad")],
      /* 7 Income and Wealth */
      [hi("dollar","Median Household: C$84,000/year","One of Canada's highest, driven by concentration of finance, tech, and professional services. Yet cost of living erodes much of this advantage.","good"),
       hi("stats","Wealth Gap: Top 10% Hold 60%","The richest 10% hold 60% of total household wealth. The bottom 40% hold virtually no net wealth — often carrying negative net worth when debts are included.","bad"),
       hi("house","After-Costs Squeeze","After housing, transport, and childcare, a family of four earning C$100,000 in Toronto has less disposable income than equivalent families in Montreal or Calgary.","bad"),
       hi("tree","Racialized Wage Gap: 30%","Racialized workers earn 30% less than non-racialized workers with equivalent qualifications — a structural gap that drives intergenerational wealth differences across communities.","bad")],
      /* 8 Environment */
      [hi("smog","Highway Air Pollution","Toronto's expressway network generates significant PM2.5 and NOx. Residents near the Gardiner and DVP face higher rates of cardiovascular disease and childhood asthma.","bad"),
       hi("tree","Ravine System: 300 km","North America's largest urban ravine network. 300 km of connected natural corridors filter stormwater, cool the city, and host 56 native tree species.","good"),
       hi("recycle","Green Bin Diversion: 52%","Toronto's organics collection diverts 100,000+ tonnes from landfill annually. The city's overall diversion rate reached 52% in 2023 — well ahead of most North American peers.","good"),
       hi("drop","Lake Ontario Sewage Overflows","Combined sewer overflows discharge raw sewage into Lake Ontario 50+ times/year during heavy rain. Intensifying storms pose a growing risk to the city's drinking water supply.","bad")],
      /* 9 Getting Around */
      [hi("metro","TTC: 3rd Busiest in North America","1.5 million trips/weekday (pre-COVID). Four subway lines plus extensive bus and streetcar network. Underfunding has caused chronic crowding and delays.","good"),
       hi("bike","Bike Share: 10,000 E-Bikes","900+ stations across the city — one of North America's largest e-bike share systems. Ridership doubled 2020–2024 as protected lane kilometres expanded.","good"),
       hi("car","Commuters Lose 118 Hours/Year to Traffic","Canada's worst congestion. The 401 is the most heavily trafficked highway in North America; daily gridlock costs the regional economy C$6B+ in lost productivity.","bad"),
       hi("stats","Transit Capital Gap: C$33B","TTC needs C$33B over 15 years for Scarborough extension, Ontario Line, and fleet renewal. Federal and provincial commitments cover less than 60% of this total.","bad")],
      /* 10 Boss: Housing */
      [hi("house","Home Quality: Generally Good","Most Toronto homes meet high Canadian building codes. Neighbourhoods are relatively safe, green space is accessible, and typical housing stock is structurally sound and well-maintained.","good"),
       hi("dollar","Average Price: C$1,093,000","Toronto's benchmark home price exceeded C$1.09M in 2024 — the second-least-affordable major housing market in North America after Vancouver.","bad"),
       hi("crane","Missing Middle Zoning Failure","Restrictive zoning blocked density on 70% of residential land until 2023. Neighbourhood opposition continues to slow badly needed mid-rise development near transit corridors.","bad"),
       hi("stats","Social Housing Waitlist: 80,000","Toronto Community Housing has an 80,000-household waitlist with 10–12 year average wait times. The agency needs C$2.6B in repairs — units are being lost faster than gained.","bad")],
    ],

    istanbul: [
      /* 0 Arts */
      [hi("temple","Hagia Sophia: 1,500 Years","Built in 537 AD — cathedral, mosque, museum, and mosque again. Now drawing 15M+ visitors annually, it is Turkey's most visited cultural site by far.","good"),
       hi("music","Istanbul Modern Arts Centre","Relocated to a Renzo Piano waterfront building in 2023. The Istanbul Biennial (est. 1987) is a landmark of international contemporary art that draws global collectors.","good"),
       hi("theatre","Bosphorus Nightlife: 200,000 Jobs","Istanbul's entertainment venues from Beyoğlu jazz clubs to rooftop bars generate THB 5B+ in cultural economy activity and support around 200,000 workers.","good"),
       hi("stats","Tourist Overcrowding","13M tourists visited in 2023. Grand Bazaar and Sultanahmet are so crowded that residents avoid them. Airbnb-driven displacement has hollowed out affordable housing in historic neighbourhoods.","bad")],
      /* 1 Civic Engagement */
      [hi("vote","2024 Municipal Victory","Opposition mayor Ekrem İmamoğlu won the 2024 Istanbul election by a larger margin than 2019, showing that urban coalitions can successfully challenge national political dominance.","good"),
       hi("flag","Muhtarlık Neighbourhood System","Istanbul's 962 mahalle each have an elected muhtar (neighbourhood headman) who channels local concerns directly to municipal government — a grassroots ombudsman network.","good"),
       hi("stats","Protest Policing","Taksim Square has been closed to May Day marches since 2012. Protest permits are routinely denied; security crackdowns have deterred civic engagement among younger residents.","bad"),
       hi("book","Press Freedom: Rank 158/180","Reporters Without Borders 2024 ranking. Most major media outlets are owned by conglomerates with government ties, limiting independent investigation and political plurality.","bad")],
      /* 2 Learning */
      [hi("school","Boğaziçi University: Academic Independence","Founded 1863, Turkey's most internationally recognised university. Known for research quality and student activism — its faculty have openly challenged government interference.","good"),
       hi("book","YKS Entrance Exam Pressure","Turkey's single national university entrance exam creates extreme stress for students. The system strongly favours those with access to expensive private tutoring (dershane), entrenching inequality.","bad"),
       hi("stats","District School Quality Gap","Schools in Beşiktaş and Kadıköy achieve results comparable to European averages; schools in Sultangazi and Esenyurt lag by 2–3 grade-level equivalents.","bad"),
       hi("temple","Curriculum Shift Since 2012","Turkey's school curriculum has shifted away from secular civic education toward religious and nationalist content, affecting critical thinking indicators in PISA performance.","bad")],
      /* 3 Getting Around */
      [hi("ferry","Bosphorus Ferries: 400,000/day","60+ routes integrated into the Istanbulkart contactless fare system. The ferry network is a beloved and efficient part of daily life for millions of commuters.","good"),
       hi("metro","15 Metro Lines, 250+ km","The network expanded from 9 to 15 lines 2019–2024. New M7 and M11 airport connections significantly reduced car dependence for airport travel.","good"),
       hi("car","Traffic: 62% Extra Travel Time","Istanbul ranks among the world's top 5 most congested cities. Average commuters spend 62% more time travelling due to traffic — equivalent to 110 hours/year lost.","bad"),
       hi("bike","Cycling Infrastructure: <120 km","For a city of 17 million, fewer than 120 km of dedicated bike lanes exist. Hills, aggressive traffic, and cultural attitudes make cycling dangerous for most residents.","bad")],
      /* 4 Housing */
      [hi("house","60,000–80,000 Quake-Vulnerable Buildings","After the 2023 Kahramanmaraş earthquake (50,000+ deaths), scientists estimate this many Istanbul structures are earthquake-vulnerable. Urban retrofitting is urgently needed.","bad"),
       hi("crane","Urban Renewal Displacement","TOKI social housing projects have displaced working-class communities in Sulukule and Fikirtepe without adequate compensation or alternative housing provision.","bad"),
       hi("dollar","Rent Inflation: 120% in 18 Months","During Turkey's 2022–2023 hyperinflation, Istanbul rents rose over 120% while TRY-denominated incomes lagged far behind. Long-term residents were forced to relocate.","bad"),
       hi("stats","22 Years' Savings to Buy","The average Istanbul household would need 22+ years of total savings to afford a median-priced apartment — well above the 10-year benchmark used by urban economists.","bad")],
      /* 5 Work */
      [hi("factory","Istanbul: 30% of Turkey's GDP","The city is home to 60% of Turkey's companies and 40% of national tax revenue, making it the indispensable economic engine of the entire country.","good"),
       hi("dollar","Inflation-Eroded Wages","Turkey's annual inflation peaked at 85% in 2022. Real purchasing power for most Istanbul workers fell significantly despite nominal wage increases.","bad"),
       hi("stats","Informal Economy: 30% of Workers","An estimated 30% of Istanbul's workforce is informal — no contracts, social security, or benefits. Informal workers dominate construction, domestic services, and street vending.","bad"),
       hi("bike","Working Hours: 1,852/year","Among the highest of OECD-comparable economies. Istanbul professionals in finance and construction commonly work 55–65 hour weeks with limited overtime protection.","bad")],
      /* 6 Health */
      [hi("hospital","Medical Tourism: 700,000/year","Istanbul attracts 700,000+ medical tourists annually for dental, cosmetic, and specialised procedures. International-standard private hospitals offer prices 40–60% below Western Europe.","good"),
       hi("heart","Universal Coverage (SGK)","Turkey's Social Security Institution covers 95% of the population. The Family Medicine system assigns each resident a registered primary care physician.","good"),
       hi("stats","Public Hospital Strain","Turkey has 1.8 doctors per 1,000 (EU average: 3.8). Public hospitals are chronically overstretched; patients routinely wait 4–6 hours for non-emergency care.","bad"),
       hi("smog","Air Pollution & Life Expectancy","Istanbul's PM2.5 levels regularly exceed WHO limits. Research links urban air quality here to a 2-year reduction in life expectancy in high-pollution districts.","bad")],
      /* 7 Safety */
      [hi("stats","Crime Index 44.5 (London: 55)","Istanbul's overall crime rate is lower than many European capitals in Numbeo's 2024 survey. Street crime and petty theft are the primary risks for residents.","good"),
       hi("flag","Geopolitical Risk Periods","Istanbul experienced major terrorist attacks in 2015–2016 and periodic political unrest. Road closures, heavy police presence, and surveillance infrastructure shape daily urban life.","bad"),
       hi("car","Road Fatalities: 5.7 per 100,000","Nearly 3× the EU average. Istanbul's narrow streets, aggressive driving culture, and mixed pedestrian-vehicle use contribute to extremely high accident rates.","bad"),
       hi("house","Femicide: 300+/year in Turkey","Turkey's femicide rate is among Europe's highest. Istanbul domestic violence reports increased 40% from 2019–2023. Women's shelters are chronically underfunded.","bad")],
      /* 8 State of the Sector */
      [hi("flag","Central Government Funding Cuts","The AKP-controlled central government reduced financial transfers to Istanbul's CHP-led municipality after 2019, creating a structural funding gap that constrains local service delivery.","bad"),
       hi("stats","CPI Score: 36/100","Turkey's 2024 Transparency International score places it in the bottom third globally. Public procurement scandals and judicial independence concerns are the primary drivers.","bad"),
       hi("factory","Istanbul Investment Decline","Political and regulatory unpredictability has deterred foreign investment. Istanbul dropped from a top-10 European investment city (2015) to outside the top 30 by 2024.","bad"),
       hi("book","Rule of Law Rank: 116/142","World Justice Project 2024. Judicial independence from the executive branch has been a consistent concern for international businesses and civil society organisations.","bad")],
      /* 9 Environment */
      [hi("smog","Bosphorus Shipping: 50,000 Vessels/year","One of the world's most polluted shipping lanes. Diesel emissions from transiting vessels are a significant contributor to Istanbul's PM2.5 levels.","bad"),
       hi("drop","Reservoir Crisis: 22% Capacity (2021)","Istanbul's reservoirs hit critically low levels due to drought and rapid population growth. The city of 17M has increasingly fragile long-term water security.","bad"),
       hi("leaf","Belgrad Forest: Green Lung","5,440 hectares of forest north of the city supplying groundwater and recreation. Faces ongoing encroachment from luxury gated community development.","good"),
       hi("tree","Urban Heat Island: +5°C","Istanbul's core urban districts are 4–6°C hotter than surrounding rural areas. Green space per person (2.4 m²) ranks among the lowest of comparable European cities.","bad")],
      /* 10 Boss: Income */
      [hi("dollar","Lira: Lost 75% vs USD (2020–2024)","The Turkish Lira collapsed from 8 to 32 per dollar. Istanbul residents priced goods in dollars; savings held in TRY were wiped out, destroying middle-class wealth.","bad"),
       hi("stats","Inflation Peak: 85.5%","Turkey's highest CPI in 24 years (late 2022). Food prices rose fastest; poorest Istanbul households spent 60%+ of income on food during the peak period.","bad"),
       hi("factory","Export Resilience","Istanbul's textile, automotive, and chemical exporters benefited from Lira depreciation. Turkey's goods exports hit a record $255B in 2023, supporting manufacturing employment.","good"),
       hi("house","Dollarized Housing Market","Property owners indexed rents and prices in USD/EUR to hedge against inflation, locking out TRY-wage earners from the property market entirely.","bad")],
    ],

    bangkok: [
      /* 0 Arts */
      [hi("temple","Wat Pho: Reclining Buddha","Built in the 16th century, Wat Pho houses the 46m Reclining Buddha and Thailand's first royal university. It still trains traditional Thai massage practitioners today.","good"),
       hi("music","Thai Street Food: UNESCO Heritage","UNESCO recognised Thai cuisine as Intangible Cultural Heritage in 2023. Bangkok has the world's highest concentration of Michelin-starred street food stalls.","good"),
       hi("theatre","Nightlife Economy: 50,000 Jobs","Bangkok's bars, clubs, and live venues generate THB 5B+ annually. Khao San Road alone hosts over 1,000 businesses serving locals, expats, and tourists.","good"),
       hi("stats","Tourist Overcrowding at Sites","Grand Palace receives 20,000+ visitors daily in peak season. Airbnb-driven displacement has hollowed out affordable housing in Silom and Sukhumvit.","bad")],
      /* 1 Housing */
      [hi("house","Condo Prices: USD 165–280K for 60m²","A Bangkok prime-area condo is a fraction of equivalent properties in Singapore, Hong Kong, or Sydney — relatively affordable for Southeast Asian standards.","good"),
       hi("drop","Flood-Prone Land: 45% of City","45% of Bangkok sits below flood stage. The 2011 floods affected 7M+ people and killed 800+ nationally. The canal drainage system is insufficient for extreme weather.","bad"),
       hi("crane","1.6M in Informal Settlements","The Khlong Toei community (100,000 people) sits on Port Authority land without secure tenure. Upgrading informal settlements without displacement is a critical policy challenge.","bad"),
       hi("stats","200,000 Unsold Condos (2024)","Developers target investors and expats, not low-income residents who need housing most. Affordable stock remains scarce despite visible overbuilding in the premium segment.","bad")],
      /* 2 Income */
      [hi("dollar","GDP Per Capita Tripled Since 2000","Thailand's per capita income has tripled in 25 years. Bangkok residents earn roughly 3× the national average, reflecting the city's outsized economic contribution.","good"),
       hi("stats","Gini: 0.43 — High Inequality","Thailand has one of Southeast Asia's most unequal distributions. In Bangkok, the richest 10% earn 25× the poorest 10%. Land and property wealth are highly concentrated.","bad"),
       hi("factory","Informal Workers: 40%+ of Workforce","Street vendors, tuk-tuk drivers, and construction workers lack contracts, social security, or legal protections. Informality is deeply embedded in Bangkok's labour market.","bad"),
       hi("drop","Minimum Wage vs. Reality","Bangkok's minimum wage (THB 400/day) is insufficient for a family. Housing, private schooling, and healthcare fees absorb most of formal-sector workers' income.","bad")],
      /* 3 Work */
      [hi("factory","Manufacturing Hub: 45% of Output","Greater Bangkok produces 45% of Thailand's manufacturing — automotive parts (Toyota, Honda), electronics (Western Digital), and textiles employing 2M+ workers.","good"),
       hi("stats","Wage Gap: Finance vs Construction","Bangkok finance workers earn THB 60,000–120,000/month; construction workers earn THB 10,000–15,000. A 6–12× gap is among the widest in Southeast Asian capital cities.","bad"),
       hi("car","Average Commute: 73 Minutes One-Way","One of the world's longest. Workers near skytrain lines have dramatically shorter commutes — spatial inequality in transit access directly creates time inequality.","bad"),
       hi("bike","48-Hour Work Week Limit: Rarely Enforced","Thai labour law caps hours at 48/week. Many hospitality, construction, and retail employees routinely work 55–65 hours with limited overtime enforcement.","bad")],
      /* 4 Health */
      [hi("hospital","Bumrungrad: 1.1M Patients/Year","Most-visited private hospital globally, treating patients from 190+ countries at 40–60% below Western European prices for equivalent procedures.","good"),
       hi("heart","Universal Coverage Scheme (UCS)","Thailand's '30 Baht Scheme' (2002) covers 75% of the population at a nominal co-pay — a remarkable achievement for a middle-income country.","good"),
       hi("stats","Public-Private Gap","80% of Bangkok's tertiary care beds are in the private sector, serving 20% of patients. The public system faces critical doctor and nurse shortages.","bad"),
       hi("leaf","Dengue: 30,000 Cases/Year","Rising urban temperatures and stagnant flood water create ideal breeding conditions. Climate change is expanding the dengue risk season into previously low-risk months.","bad")],
      /* 5 Learning */
      [hi("book","Chulalongkorn University (1917)","Thailand's oldest and most prestigious university. Its graduates dominate the professional and political elite; it ranks in Asia's top 100 universities.","good"),
       hi("school","100+ International Schools","Bangkok's international school ecosystem — British, American, IB, Singapore curricula — is the main reason multinational companies choose Bangkok for regional HQs.","good"),
       hi("stats","Rural-Urban PISA Gap: 80–90 Points","Bangkok students score 80–90 PISA points above rural northern Thailand students — a 2–3 year schooling gap that drives massive internal migration to the capital.","bad"),
       hi("dollar","Private Tutoring: 20–30% of Income","The Bangkok tutoring market is worth THB 20B+/year. Middle-class families spend 20–30% of household income on tutoring, deeply entrenching educational inequality.","bad")],
      /* 6 Civic Engagement */
      [hi("vote","2023 Election: Parliament Blocked Move Forward","The progressive Move Forward party won the most seats but was blocked from forming government by the military-appointed Senate, frustrating millions of young voters.","bad"),
       hi("flag","2020–2021 Student Protests","Demonstrations calling for constitutional reform drew 100,000+. Leaders face lèse-majesté charges; political participation remains legally risky in Thailand.","bad"),
       hi("stats","2,000+ Community Development Councils","Bangkok's CDA network organises local sanitation, welfare, and culture where formal municipal services fall short. These bottom-up networks are essential urban infrastructure.","good"),
       hi("book","Computer Crimes Act: Political Speech","Thailand's CCA has been used to prosecute online political speech. Freedom House rates Thailand as 'Not Free' for internet freedoms, deterring digital civic engagement.","bad")],
      /* 7 State of the Sector */
      [hi("flag","12 Military Coups (20th Century)","Thailand's most recent coup was in 2014. Military-drafted constitutions reserved 250 Senate seats for junta appointees until 2024, constraining democratic governance.","bad"),
       hi("stats","THB 6.5T Infrastructure Investment","Thailand invested THB 6.5T (~USD 178B) in transport infrastructure 2015–2025: Bangkok suburban rail, Eastern Economic Corridor roads, and new airport links.","good"),
       hi("factory","Digital Economy: Progress Slow","Thailand's 25%-of-GDP digital economy target by 2030 is off-track. Infrastructure outside Bangkok is underdeveloped; e-government services remain fragmented.","bad"),
       hi("dollar","Public Debt: 41% → 62% of GDP","COVID relief spending and political uncertainty limited the government's ability to invest in long-term urban infrastructure or social programmes.","bad")],
      /* 8 Safety */
      [hi("car","Road Fatalities: 22 per 100,000","One of the world's highest rates — 22 per 100,000, compared to a 17 global average. Bangkok's roads account for 30%+ of national road fatalities.","bad"),
       hi("stats","200,000 Moto Taxis — Essential But Unregulated","Bangkok's motorcycle taxis navigate traffic where no other vehicle can. They serve millions as an essential last-mile option but operate with minimal safety regulation.","good"),
       hi("flag","50,000 Tourist Police Complaints/Year","Persistent scams, gem fraud, and overcharging make Bangkok challenging for tourists. The Tourism Authority's tourist police unit handles 50,000+ formal complaints annually.","bad"),
       hi("house","Women's Safety Concerns","Bangkok's street harassment rate is among the highest of Southeast Asian capitals. Public lighting deficits and isolated areas at night contribute to elevated risk for women.","bad")],
      /* 9 Getting Around */
      [hi("metro","BTS Skytrain: 900,000 Trips/Day","100+ km across 5 lines. Extensions to outer suburbs have transformed commuting; the rail system is expanding faster than any other in Southeast Asia.","good"),
       hi("ferry","Chao Phraya Ferry: 60,000/day","Orange-flag river ferries run without surcharge, making the river an accessible mobility corridor for lower-income commuters who can't afford BTS fares.","good"),
       hi("car","Traffic: 61 Hours Lost Annually","Bangkok's 7th worst congestion globally (TomTom 2023). Cheap fuel subsidies and inadequate parking alternatives actively encourage car use despite the expanding rail system.","bad"),
       hi("bike","Bike Share Closed 2019","Bangkok's bicycle share scheme closed due to low ridership. Heat, lack of protected lanes, and motorcycle dominance make cycling impractical for most urban trips.","bad")],
      /* 10 Boss: Environment */
      [hi("smog","PM2.5: 3× WHO Limit","Bangkok's 2024 average PM2.5 of 30.7 μg/m³ is 3× the WHO guideline. February–April burning season regularly pushes readings above 100 μg/m³.","bad"),
       hi("drop","Bangkok is Sinking: 1–10 cm/year","Groundwater extraction and the weight of construction on soft clay soil cause subsidence. Parts of Bangkok may be below sea level by 2030 as climate raises seas.","bad"),
       hi("tree","1,700 km of Canals (Khlongs)","Bangkok's historic waterway network controls flooding and supports biodiversity. Restored khlongs in Khlong San and Thonburi are reviving urban water ecosystems.","good"),
       hi("leaf","Green Space: 7 m² per Person","Well below the WHO minimum of 9 m². Bangkok's 2030 Green Plan targets 10 m² but lacks sufficient land acquisition budget to deliver the goal.","bad")],
    ],

    newdelhi: [
      /* 0 Arts */
      [hi("temple","3 UNESCO World Heritage Sites","Qutub Minar, Humayun's Tomb, and Red Fort Complex. Delhi's layered history — Mughal to colonial — is physically embedded in the city's urban fabric.","good"),
       hi("music","Hindustani Classical Music Scene","Delhi hosts India's premier classical institutions. The city's cultural budget funds 200+ festivals annually across music, dance, theatre, and visual arts.","good"),
       hi("palette","National Museum: 200,000 Artefacts","Spanning 5,000 years of history. The National Gallery of Modern Art holds South Asia's most important contemporary collection.","good"),
       hi("stats","Heritage Site Overcrowding","Red Fort and India Gate draw 15,000–30,000 visitors/day. Site management, plastic litter, and vendor encroachment degrade heritage integrity.","bad")],
      /* 1 Learning */
      [hi("school","IIT Delhi — Asia Rank 46","Graduates lead global technology companies. Alumni co-founded Infosys, built Paytm, and lead OYO — IIT Delhi's reach spans the tech world.","good"),
       hi("book","96%+ Primary Enrollment","India's universal elementary education mission achieved near-universal primary enrollment in Delhi by 2023, up from under 80% in 2000 — a massive infrastructure achievement.","good"),
       hi("stats","Learning Poverty: 50%+ in Grade 5","ASER data shows more than half of Delhi government school students in Grade 5 cannot read a Grade 2 text. Enrollment improved dramatically; learning outcomes lag.","bad"),
       hi("dollar","Private School: INR 40k–300k/year","Middle-class families spend heavily on private schooling. The parallel private system entrenches inequality; government school quality has not kept pace with enrollment growth.","bad")],
      /* 2 Work */
      [hi("factory","Delhi-NCR: India's 2nd Tech Hub","Gurgaon and Noida host Amazon, Microsoft, and Infosys, employing 500,000+ white-collar workers. The corridor is India's fastest-growing services cluster.","good"),
       hi("stats","Informal Workers: 75% of Workforce","Rickshaw drivers, street vendors, construction labour, and domestic workers lack contracts, social security, or minimum wage enforcement.","bad"),
       hi("dollar","Gender Wage Gap: 30%","Women in Delhi's formal economy earn 30% less than men for equivalent work. Female workforce participation (20%) is among the lowest of any major global city.","bad"),
       hi("car","Commute: 71 Minutes One-Way","Delhi's average commute is the longest of any Indian city. Road congestion, slow buses, and last-mile gaps from metro stations compound the problem.","bad")],
      /* 3 Civic Engagement */
      [hi("vote","Assembly Election Turnout: 67%","Delhi assembly elections consistently achieve 60–70% turnout, with strong participation from low-income communities who use the vote to demand better local services.","good"),
       hi("flag","Mohalla Clinics: 400+ Neighbourhood Facilities","The Aam Aadmi Party built 400+ free neighbourhood health clinics serving 3M+ consultations annually. This model has been studied internationally as a low-cost service innovation.","good"),
       hi("stats","Systemic Corruption Persists","Despite the 2011–2012 anti-corruption movement that spawned AAP, petty corruption in Delhi's civic administration persists. India scores 39/100 on CPI 2024.","bad"),
       hi("book","Civil Society Restrictions","India's 2020 FCRA amendments limited NGO foreign funding. Multiple Delhi-based civil society organisations lost registrations; academic freedom at JNU has faced political pressure.","bad")],
      /* 4 Health */
      [hi("hospital","AIIMS: 8,000 Patients/Day","All India Institute of Medical Sciences is South Asia's premier medical institution — treating 8,000 outpatients daily and training 10,000 specialists per year.","good"),
       hi("heart","Life Expectancy: 73 Years","Lower than India's richest states. While medical infrastructure is strong for the wealthy, air pollution, unsafe water, and inequality keep outcomes below global comparators.","bad"),
       hi("smog","PM2.5: 17× WHO Annual Limit","Delhi's 2023 average PM2.5 of 102 μg/m³ is 17× above the WHO guideline. The WHO estimates this costs Delhi residents an average 10 years of healthy life.","bad"),
       hi("stats","Public Hospital Overflow","LNJP and Safdarjung hospitals each see 5,000–7,000 outpatients daily with insufficient beds. Critical cases are routinely refused admission due to overflow.","bad")],
      /* 5 State of the Sector */
      [hi("flag","Three-Tier Governance Conflict","Delhi is simultaneously India's capital and a union territory, with overlapping central and elected state authority. This constitutional conflict has paralysed road repair, land use, and policing reform.","bad"),
       hi("stats","Delhi Metro: Rare Governance Success","391 km delivered on time and budget by DMRC's quasi-autonomous model — a striking exception that highlights how poor ordinary civic delivery is across other departments.","good"),
       hi("factory","E-District: Digitised Services","Property tax, driving licences, and school admissions digitised via the e-District portal — reforms that cut physical visits and measurably reduced petty corruption.","good"),
       hi("dollar","MCD Revenue: 60% Collection Rate","The Municipal Corporation of Delhi runs persistent deficits. A large informal economy and political resistance to property tax reform constrain spending on basic services.","bad")],
      /* 6 Income */
      [hi("dollar","Per Capita GSDP: USD 5,500","Among India's highest. Delhi's concentration of high-paying government, tech, and service sector jobs produces a per-capita income well above the national average.","good"),
       hi("stats","Top 10% Earn 30× Bottom 10%","Extreme inequality in Delhi. A small elite controls land, property, and financial assets. The gap is widening as property values outpace wage growth.","bad"),
       hi("house","1.7M in Jhuggi Clusters","675 slum clusters house 1.7 million people — often without secure tenure, piped water, or sanitation. Evictions during infrastructure projects remain routine.","bad"),
       hi("tree","Green Inequality Mapped to Income","Lutyens Zone (government district): 25+ m²/person. East Delhi: under 1 m²/person. Delhi's green distribution maps almost perfectly onto income inequality.","bad")],
      /* 7 Getting Around */
      [hi("metro","Delhi Metro: 5M+ Trips/Day","Asia's second-busiest metro, 286 stations. Phase 4 (113 km under construction) will extend the network to underserved eastern and northern areas.","good"),
       hi("bike","1 Million E-Rickshaws","Zero-emission last-mile mobility serving low-income neighbourhoods the metro doesn't reach. E-rickshaws employ 5M+ workers nationally and cut inner-city noise.","good"),
       hi("car","12M Registered Vehicles — World Record","The most of any city globally relative to road space. Even-odd vehicle restrictions have limited impact: the total fleet size overwhelms any day-based restriction.","bad"),
       hi("smog","Odd-Even Policy: 2–3% Pollution Reduction","Politically controversial but barely effective. The policy reduces traffic 5–8% on operating days but cuts air pollution by only 2–3% — an inadequate response to a crisis.","bad")],
      /* 8 Housing */
      [hi("house","Housing Deficit: 2.4 Million Units","Delhi faces a critical shortage for low and middle-income groups. DDA (Delhi Development Authority) construction consistently falls short of annual targets.","bad"),
       hi("crane","Yamuna Floodplain Encroachment","Hundreds of thousands live on the legally protected floodplain. The 2023 Yamuna floods displaced 25,000+ people who had no legal alternative housing available.","bad"),
       hi("dollar","South Delhi Property: INR 30–80k/sqft","The housing market is dominated by investors. Affordability is deteriorating faster than incomes grow, and new supply consistently targets the top 20% of earners.","bad"),
       hi("drop","30% Without Piped Water","Water is supplied by tanker in many informal areas — costing residents 10× more per litre than piped customers while delivering far lower water quality and reliability.","bad")],
      /* 9 Safety */
      [hi("stats","India's 3rd Highest Crime Rate","Crimes against women — including sexual assault and street harassment — are significantly higher than the national average, discouraging women's public mobility.","bad"),
       hi("flag","Delhi Police: Central Control","Delhi Police report to the Central Home Ministry rather than the state government — an anomaly creating accountability gaps and slow response to local priorities.","bad"),
       hi("house","Women's Safety Index: Near Bottom","Delhi ranks among South Asia's least safe major cities for women. Public transit safety (metro excepted), street harassment, and peripheral area lighting are critical factors.","bad"),
       hi("car","1,500 Road Deaths/Year in Delhi","Despite India's 2019 Motor Vehicles Act with steep fines, enforcement is selective. Wealthy drivers routinely escape consequences; fatalities are concentrated among pedestrians and cyclists.","bad")],
      /* 10 Boss: Environment */
      [hi("smog","World's Most Polluted Capital 2023","IQAir ranked New Delhi #1 most polluted capital city. Annual average PM2.5 of 92 μg/m³ contributes to an estimated 1 million premature deaths per year across India.","bad"),
       hi("drop","Yamuna River: Biologically Dead","Zero dissolved oxygen in most Delhi stretches — biologically dead. Receives 80% of Delhi's untreated sewage despite decades of remediation plans.","bad"),
       hi("tree","Urban Forest Cover: 20%","Higher than most South Asian megacities. The Delhi Ridge forest acts as the city's green lung; ongoing conservation efforts prevent further encroachment.","good"),
       hi("leaf","Stubble Burning: 30–40% of Worst Pollution","Seasonal burning in neighbouring Haryana and Punjab drifts into Delhi under temperature inversions every October–November, creating the year's most dangerous air quality episodes.","bad")],
    ],

    lagos: [
      /* 0 Arts */
      [hi("music","Afrobeats: #1 in 92 Countries (2023)","Burna Boy, Wizkid, and Davido alone generate USD 800M+ for Nigeria's creative economy annually. Lagos is the undisputed global hub of the world's fastest-growing music genre.","good"),
       hi("palette","Nollywood: World's 2nd Largest Film Industry","Lagos produces 1,000–2,500 films/year — second globally after Bollywood. Films reach across sub-Saharan Africa and sustain a diaspora cultural connection worldwide.","good"),
       hi("theatre","Nike Art Gallery: Africa's Largest Private Collection","Lagos's independent arts scene is anchored by Terra Kulture, Nike Art Gallery, and the Lagos International Jazz Festival — a growing cultural infrastructure despite resource limits.","good"),
       hi("stats","Public Recreation: 0.3 m²/Person","Among the world's lowest. Lekki Conservation Centre and National Arts Theatre are bright spots in a severely underprovisioned urban recreation landscape.","bad")],
      /* 1 Work */
      [hi("factory","Lagos: 25–30% of Nigeria's GDP","With 3% of Nigeria's population, Lagos generates 25–30% of national GDP. It hosts the Nigerian Stock Exchange and HQs for Africa's largest companies.","good"),
       hi("dollar","Youth Unemployment: 33%","Official youth unemployment exceeds 33%, with underemployment far higher. The 'Japa' phenomenon — mass emigration of educated youth — is draining the city of its most skilled workers.","bad"),
       hi("stats","Informal Workers: 65% of Workforce","Danfo operators, artisans, food sellers, and mechanics lack legal protection, social security, and access to formal credit. Informality is the economic reality for most Lagosians.","bad"),
       hi("car","Commute: 2.5 Hours Average Each Way","One of the world's longest commutes. Poor road infrastructure, gridlock, and no functional urban rail (until the recent BRT and Blue Line) compound the problem.","bad")],
      /* 2 Civic Engagement */
      [hi("vote","#ENDSARS 2020: Largest Civic Mobilisation","The protest against police brutality drew hundreds of thousands across Lagos and Nigeria — demonstrating civil society's power and the youth generation's political consciousness.","good"),
       hi("flag","CPI 26/100: High Corruption","Nigeria's 2024 Transparency International score reflects endemic corruption in procurement, policing, and public service delivery. Informal payments ('dash') are widely seen as unavoidable.","bad"),
       hi("stats","Voter Turnout: 27% (2023 Presidential)","Logistical failures, fear of electoral violence, and disillusionment combined to historically depress participation. Low turnout concentrates power with elites who can mobilise resources.","bad"),
       hi("book","Community Development Associations","Lagos's CDAs organise refuse collection, road patching, and security where government services fail. These bottom-up networks sustain daily life across the metropolis.","good")],
      /* 3 Learning */
      [hi("school","Lagos State University: 40,000+ Students","Lagos State government increased education spending to 18% of the state budget in 2023 — above the UN-recommended 15% — reflecting genuine political prioritisation.","good"),
       hi("book","1.2 Million Children Out of School","Cost, distance, and child labour are primary barriers (UNICEF 2023), concentrated in Ajegunle, Mushin, and Ojo LGAs where poverty is most severe.","bad"),
       hi("stats","40% of Teachers Fail Competency Tests","Low salaries (NGN 50,000–80,000/month) make teaching unattractive to qualified graduates. Teacher quality is the single most important bottleneck in Lagos school reform.","bad"),
       hi("dollar","12,000 Private Schools: Extreme Variation","From elite international schools at NGN 5M+/year to unregulated proprietor schools in zinc-roof buildings. The private sector fills the gap left by weak public provision — at great cost inequality.","bad")],
      /* 4 Income */
      [hi("dollar","Gini: 0.51 — Extreme Inequality","The Lekki-Victoria Island elite live in gated compounds with generators and private water; Ajegunle residents lack piped water entirely. Few cities show starker spatial inequality.","bad"),
       hi("stats","Growth Without Inclusion","Lagos's economy grew 6%+/year 2010–2019, yet poverty rates remained above 40%. Growth was concentrated in finance and real estate — sectors with high productivity but low employment.","bad"),
       hi("factory","Lekki Free Trade Zone: USD 1.5B Investment","The Dangote Refinery complex promises 650,000 barrels/day refining capacity, ending Nigeria's dependence on imported fuel and creating tens of thousands of direct and indirect jobs.","good"),
       hi("house","60%+ Live on Under USD 5/Day","Lagos is now more expensive than many European cities for imported goods and services. This gap between costs and incomes makes the city economically unsustainable for most residents.","bad")],
      /* 5 State of the Sector */
      [hi("flag","Lagos State: Fiscally Independent Since 2007","Lagos collects its own internally generated revenue (NGN 1.1T in 2023) — funding infrastructure without oil revenue. It is Africa's most financially self-sufficient sub-national government.","good"),
       hi("stats","Infrastructure Gap: USD 60B Needed","World Bank estimate for 20-year infrastructure needs. Current spending covers less than 15% — resulting in endemic power outages, flooding, and road failures.","bad"),
       hi("factory","Silicon Lagoon: USD 1.2B VC (2021)","Andela, Flutterwave, and Paystack all emerged from Lagos. The startup ecosystem is now Africa's most active, attracting global venture capital and talent.","good"),
       hi("dollar","Pay Three Times for Services","Taxes to government + fees to private providers (generators, boreholes, private security) + informal payments to community protectors. This triple burden falls hardest on lower-income households.","bad")],
      /* 6 Health */
      [hi("hospital","1 Doctor per 5,000 People","25× below WHO standards. Brain drain to UK, US, and Canada is depleting the medical workforce faster than training can replace it. Public hospitals lack drugs and basic equipment.","bad"),
       hi("heart","Life Expectancy: 53 Years (Nigeria)","Among the world's lowest. In Lagos, access to private healthcare extends this for the wealthy — but the poor face catastrophic health shocks from treatable conditions.","bad"),
       hi("stats","20,000+ Cholera Cases (2023)","Contaminated wells and streams in waterfront communities are vectors. The formal water system covers only 40% of the city; the rest relies on unregulated boreholes and tankers.","bad"),
       hi("leaf","Mental Health: 10M Untreated in Nigeria","Mental health care is virtually absent from Lagos's public system. Stigma, cost, and complete lack of facilities keep millions of Nigerians with serious conditions unserved.","bad")],
      /* 7 Housing */
      [hi("house","Housing Deficit: 2.4 Million Units (Lagos Share)","Nigeria's national deficit is 17 million units. Population growth of 600,000/year outpaces affordable construction by a factor of 5 in Lagos.","bad"),
       hi("drop","Makoko: 150,000–300,000 on Water","This waterfront stilt community has no piped water, sewage, or electricity. Partial demolitions in 2012 and 2017 displaced thousands without resettlement options.","bad"),
       hi("crane","70% of Construction Targets Top 10%","Ikoyi, Lekki, and Victoria Island developments command NGN 100M–2B per unit — unreachable for 95% of residents. The formal sector is not building for Lagos's actual population.","bad"),
       hi("stats","<10% Hold Formal Land Titles","Forced evictions without compensation are common: Badia East (2013), Otodo-Gbame (2017), and Tarkwa Bay (2020) displaced tens of thousands of people without legal recourse.","bad")],
      /* 8 Environment */
      [hi("smog","Open Burning: Primary Waste Disposal","No functional waste-to-energy facility exists. Open burning at dumpsites and informal settlements is the primary disposal method for millions. PM2.5 concentrations regularly exceed 40 μg/m³.","bad"),
       hi("drop","60% of Lagos is Flood-Prone","The 2012 floods killed 363 people and displaced 2M; 2022 floods damaged 50,000 homes. Rapid urbanisation of natural floodplains makes each extreme rainfall event worse than the last.","bad"),
       hi("leaf","Mangrove Cover Lost: 70% Since 1985","Mangroves buffer storm surge, filter water, and sequester carbon. Their loss accelerates flooding and coastal erosion across the entire Lagos metropolitan coastline.","bad"),
       hi("recycle","Waste: 15,000 Tonnes/day, 40% Collected","The rest ends up in drainage channels — contributing directly to flooding and disease. Lagos generates more waste than its collection system can manage.","bad")],
      /* 9 Safety */
      [hi("stats","Crime Index: 68.5 (Numbeo 2024)","The highest of any city in this campaign. Armed robbery, vehicle theft, and kidnapping for ransom are significant risks for all social classes in Lagos.","bad"),
       hi("flag","SARS Disbanded, Reformed Under New Names","Extortion, arbitrary detention, and brutality by police persist as documented human rights issues after the 2020 #ENDSARS protests that demanded disbandment.","bad"),
       hi("car","Danfo Buses: Thousands of Deaths Annually","Overloaded, poorly maintained minibuses with aggressive drivers are a leading cause of traumatic injury death for young Lagosians. Road fatality enforcement is minimal.","bad"),
       hi("house","Community Vigilance Groups","In areas with weak policing, community security groups fill the vacuum. They provide some crime deterrence but operate without legal oversight or accountability.","good")],
      /* 10 Boss: Getting Around */
      [hi("car","15 Hours Lost Per Week to Traffic","Among the world's worst. The 3M+ vehicle fleet — dominated by aging minibuses and motorcycles — uses a road network built for 500,000 vehicles.","bad"),
       hi("metro","Blue Rail Line: Sub-Saharan Africa's First Urban Rail","Opened 2023 — the first functional urban metro rail in sub-Saharan Africa in decades. BRT carries 500,000 passengers/day on dedicated lanes, transforming specific corridors.","good"),
       hi("ferry","Lagoon Ferry: 40,000 Riders/day","Lagos's waterways are an underused mobility corridor. Cowrie Creek ferry routes could expand significantly with investment in terminals and modern vessels.","good"),
       hi("stats","USD 19B Transport Investment Needed","World Bank 20-year estimate. Current spending is under 10% of this. Without significant rail expansion, gridlock will worsen as population grows toward 35M by 2035.","bad")],
    ],
  };

  var G = window.GEOGRAPHY_DASH;
  G.cities.forEach(function (city) {
    var items = ITEMS[city.id];
    if (!items) return;
    city.stages.forEach(function (st, si) {
      st.hubItems = items[si] || [];
    });
  });
})();
