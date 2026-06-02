/**
 * Geography Dash - Hub collectible items for every stage in every city.
 * 4 items per stage: 2 good (strengths), 2 bad (pressures).
 * Sources: EIU Liveability 2024, OECD, WHO, IEA, World Bank, Numbeo, city gov reports.
 */
const HUB_ITEMS = {

  // ─────────────────────────────────────────────
  // COPENHAGEN  (difficulty 0.28)
  // ─────────────────────────────────────────────
  copenhagen: [
    // Stage 1 - Environment 5/5
    [
      {
        kind: "turbine",
        title: "Offshore Wind Leader",
        body: "Denmark generated 88% of its electricity from wind and solar in 2024, the highest share of any large grid in the world. The Horns Rev 3 offshore wind farm (407 MW, commissioned 2019) alone powers roughly 425,000 Danish homes.",
        valence: "good",
      },
      {
        kind: "bike",
        title: "Carbon-Neutral by 2025",
        body: "Copenhagen's city council set a 2025 carbon-neutrality target and by 2023 had cut municipal CO₂ emissions 80% below 2005 levels. The city's district heating network, fed largely by waste heat and biomass, serves over 98% of residents.",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "Green Tax Burden",
        body: "Denmark's CO₂ tax rose to DKK 750 per tonne (~€100) in 2024 under the 2022 Green Tax Reform, one of the steepest carbon prices in the world. While effective, it raises energy costs for households and small businesses.",
        valence: "bad",
      },
      {
        kind: "smog",
        title: "Consumption Footprint",
        body: "Despite clean local energy, Danes' per-capita material footprint exceeds 20 tonnes per year (OECD 2023), driven by imports and high consumption. The city's Scope 3 emissions - goods made abroad - remain largely unaccounted in official totals.",
        valence: "bad",
      },
    ],

    // Stage 2 - Getting Around 5/5
    [
      {
        kind: "bike",
        title: "62% Commute by Bike",
        body: "In 2022, 62% of Copenhagen residents cycled to work or study every day - even in winter. The city maintains 390 km of protected cycle tracks and plans a further 60 km of cycle superhighways by 2030.",
        valence: "good",
      },
      {
        kind: "metro",
        title: "Metro Circle Line",
        body: "The Cityringen metro loop (opened 2019, 17 stations) runs 24/7 and carries over 100 million passengers annually. Combined with S-trains and regional rail, Copenhagen ranks among Europe's best-connected capitals for car-free travel.",
        valence: "good",
      },
      {
        kind: "car",
        title: "Winter Cycling Drops",
        body: "Despite heated cycle paths at key junctions, cycling rates fall roughly 20–25% during icy months (City of Copenhagen traffic counts, 2023). Older residents and people with disabilities report the winter network as the biggest gap in the system.",
        valence: "bad",
      },
      {
        kind: "dollar",
        title: "High Car Ownership Tax",
        body: "Denmark levies a vehicle registration tax of up to 150% of a new car's value, making private cars the most expensive in the EU. While this suppresses car use, it places a disproportionate burden on rural and suburban commuters outside the metro zone.",
        valence: "bad",
      },
    ],

    // Stage 3 - Safety 5/5
    [
      {
        kind: "flag",
        title: "Top-5 Safest City",
        body: "The Economist's Safe Cities Index 2021 ranked Copenhagen 3rd globally. The city recorded just 1.4 homicides per 100,000 residents in 2022, compared with a Western European average of about 1.1 - near the continent's lowest.",
        valence: "good",
      },
      {
        kind: "vote",
        title: "Police Trust at 87%",
        body: "A 2023 Statistics Denmark survey found 87% of Copenhageners trust the police - one of the highest rates in the EU. Community policing programs in mixed-income neighbourhoods like Nørrebro have maintained that trust through dialogue rather than enforcement.",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "Pickpocketing Hotspots",
        body: "Strøget pedestrian street and Central Station report consistent pickpocketing: Copenhagen Police logged over 3,000 theft-from-person incidents in 2022. Tourism growth correlates directly with seasonal spikes in petty crime.",
        valence: "bad",
      },
      {
        kind: "flag",
        title: "Gang Territory Tensions",
        body: "Though rare, gang conflicts periodically flare in outer districts like Tingbjerg. In 2020 the government designated several housing estates 'ghetto areas' under law - a policy criticised by residents and human-rights groups as discriminatory.",
        valence: "bad",
      },
    ],

    // Stage 4 - Health 5/5
    [
      {
        kind: "hospital",
        title: "Universal Free Healthcare",
        body: "Denmark's publicly funded healthcare (financed through taxes at roughly 10% of GDP) provides free GP visits, hospital care, and most specialist services. Life expectancy reached 81.3 years in 2023, above the EU average of 80.5.",
        valence: "good",
      },
      {
        kind: "bike",
        title: "Active Commuting Wins",
        body: "A 2023 DTU Transport study found Copenhagen cyclists have 40% lower all-cause mortality than non-cyclists of the same age. The city attributes an estimated DKK 1.22 in healthcare savings for every kilometre cycled on the network.",
        valence: "good",
      },
      {
        kind: "hospital",
        title: "Specialist Wait Times",
        body: "Despite strong primary care, Rigshospitalet and Herlev Hospital reported average outpatient specialist waits of 40–60 days for non-urgent referrals in 2023. Mental health services face the longest queues - up to 6 months for first psychiatric appointments.",
        valence: "bad",
      },
      {
        kind: "dollar",
        title: "Alcohol Harm Costs",
        body: "Denmark has one of Europe's highest alcohol consumption rates (9.7 litres pure alcohol per adult, WHO 2022). Alcohol-related hospital admissions cost the Danish health system an estimated DKK 8 billion per year, straining capacity.",
        valence: "bad",
      },
    ],

    // Stage 5 - Civic Engagement 5/5
    [
      {
        kind: "vote",
        title: "84% Voter Turnout",
        body: "Denmark's 2022 general election saw 84.2% turnout - among the world's highest for a voluntary voting system. Copenhagen's municipal elections regularly exceed 70%, reflecting deep public trust in local governance.",
        valence: "good",
      },
      {
        kind: "flag",
        title: "Ranked 1st: Democracy",
        body: "Denmark topped the EIU Democracy Index 2023 with a score of 9.28/10, reflecting strong civil liberties, functioning government, and political culture. Copenhagen serves as the model for citizen participation through its 'Borgerrepræsentationen' council.",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "Tax Debate Fatigue",
        body: "A 2023 Eurobarometer poll found 38% of Danes believe the tax burden is unfairly distributed, fuelling sustained political tension between parties. High marginal rates (top rate ~56%) regularly dominate election campaigns at the expense of other civic issues.",
        valence: "bad",
      },
      {
        kind: "flag",
        title: "Immigration Polarization",
        body: "Danish politics has been reshaped by migration debates since 2015; the 2022 election saw four parties win seats partly on restrictive immigration platforms. Civic cohesion surveys show a 12-point gap in institutional trust between native-born Danes and first-generation immigrants.",
        valence: "bad",
      },
    ],

    // Stage 6 - State of the Sector 5/5
    [
      {
        kind: "flag",
        title: "Corruption Perceptions: #1",
        body: "Denmark ranked 1st on Transparency International's Corruption Perceptions Index in 2023 with a score of 90/100, a position it has held jointly or outright for a decade. Public procurement scandals are rare and swiftly prosecuted.",
        valence: "good",
      },
      {
        kind: "temple",
        title: "World-Class Institutions",
        body: "Copenhagen hosts the Nordic Council, UNHCR Europe, and EMA satellite offices. Denmark's public-sector employment is roughly 30% of the workforce, delivering comprehensive welfare from cradle to grave, funded by among the world's highest income-tax revenues.",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "Welfare Cost Pressure",
        body: "Total public expenditure reached 53% of GDP in 2023 (Statistics Denmark), one of the EU's highest ratios. Ageing demographics threaten long-term fiscal balance: by 2040 the old-age dependency ratio is projected to rise from 30 to 40 per 100 workers.",
        valence: "bad",
      },
      {
        kind: "factory",
        title: "Defence Spending Surge",
        body: "Following Russia's 2022 invasion of Ukraine, Denmark committed to raising defence spending from 1.3% to 2% of GDP by 2030, absorbing DKK 12 billion annually. This redirection of funds has sparked internal debate over welfare priorities.",
        valence: "bad",
      },
    ],

    // Stage 7 - Income and Wealth 5/5
    [
      {
        kind: "dollar",
        title: "Low Gini Coefficient",
        body: "Denmark's Gini coefficient stood at 0.29 in 2023 (OECD), among the world's most equal income distributions. The bottom 20% of earners receive 9.5% of total income - roughly double the share seen in the United States.",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "GDP per Capita €62,000",
        body: "Denmark's GDP per capita reached approximately €62,000 in 2023 (Eurostat), ranking it 5th in the EU. Minimum wages are set by collective bargaining at roughly DKK 140/hour (~€18.80), the highest de-facto floor in Europe.",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "56% Top Tax Rate",
        body: "The top marginal income tax rate of 55.9% (2024) kicks in at incomes above roughly DKK 568,900 (~€76,000) per year. While funding the welfare state, it can deter some high-earning specialists from staying long-term in Denmark.",
        valence: "bad",
      },
      {
        kind: "house",
        title: "Wealth Tied to Property",
        body: "Over 60% of Danish household wealth is locked in owner-occupied housing (Danmarks Nationalbank 2023). This magnifies inequality between homeowners and renters, and means younger generations who cannot enter the market fall further behind.",
        valence: "bad",
      },
    ],

    // Stage 8 - Learning 5/5
    [
      {
        kind: "school",
        title: "Free University Education",
        body: "All Danish universities are tuition-free for EU citizens, and students receive a monthly government grant (SU) of up to DKK 7,088 (~€950) to cover living costs. The University of Copenhagen ranks consistently in the global top 100 (QS 2024: #97).",
        valence: "good",
      },
      {
        kind: "book",
        title: "PISA Maths Leap 2022",
        body: "Danish 15-year-olds improved by 14 PISA points in mathematics between 2018 and 2022, one of the largest gains in the OECD. The reform-driven 'erhvervsuddannelse' (vocational) track retains over 40% of students, reducing degree-credential bias.",
        valence: "good",
      },
      {
        kind: "book",
        title: "Ethnic Learning Gap",
        body: "Students with non-Western immigrant backgrounds score on average 77 PISA points lower in reading than Danish-origin peers (Statistics Denmark 2022) - a gap that persists even after controlling for socioeconomic status, signalling systemic school integration challenges.",
        valence: "bad",
      },
      {
        kind: "dollar",
        title: "Teacher Shortage Grows",
        body: "Denmark had approximately 5,000 unfilled teaching positions in 2023, particularly in maths, physics, and Danish as a second language. A 2013 lockout-driven reform that extended teacher hours without raises contributed to lasting morale problems in the profession.",
        valence: "bad",
      },
    ],

    // Stage 9 - Work 4/5
    [
      {
        kind: "dollar",
        title: "Flexicurity Model",
        body: "Denmark's 'flexicurity' system combines easy hiring and firing by employers with generous unemployment benefits (up to 90% of prior wages for low earners, capped at DKK 19,322/month) and active re-employment support. Unemployment stood at just 5% in 2024.",
        valence: "good",
      },
      {
        kind: "bike",
        title: "37-Hour Work Week Norm",
        body: "The standard Danish full-time week is 37 hours, with 5–6 weeks' paid annual leave mandated by collective agreement. Denmark ranks 3rd in the OECD 2023 Better Life Index for work-life balance, behind only France and Spain.",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "Labour Costs Deter Firms",
        body: "Total hourly labour costs in Denmark averaged €47.50 in 2023 (Eurostat) - the EU's 3rd highest. Some manufacturers and logistics companies have relocated operations to Germany or Eastern Europe, citing wage and employer-contribution costs.",
        valence: "bad",
      },
      {
        kind: "factory",
        title: "Automation Risk for Mid-Skill",
        body: "A 2023 Teknologisk Institut report estimated that 37% of Danish jobs face high automation risk by 2035, concentrated in transport, retail, and clerical sectors. Retraining programs exist but are underutilised by workers over 50.",
        valence: "bad",
      },
    ],

    // Stage 10 - Arts, Culture & Recreation 4/5
    [
      {
        kind: "temple",
        title: "World Design Capital 2023",
        body: "Copenhagen was named World Design Capital for 2023 by the World Design Organization, recognising its design-driven approach to public space, furniture, and architecture. The city spends roughly DKK 1.4 billion annually on cultural institutions.",
        valence: "good",
      },
      {
        kind: "plaque",
        title: "Free Museums & Harbour Bath",
        body: "Copenhagen's permanent collections at the National Museum and SMK (National Gallery) are free for under-26s; the harbour baths at Islands Brygge attract over 800,000 visits per summer. These free assets democratise culture and physical recreation.",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "Concert Ticket Inflation",
        body: "Average concert and theatre ticket prices in Copenhagen rose 31% between 2020 and 2024 (Statistics Denmark CPI data), pricing lower-income residents out of live events. The city's world-famous Roskilde Festival saw no-go rates climb among 18–24 year-olds citing cost.",
        valence: "bad",
      },
      {
        kind: "smog",
        title: "Overtourism Pressure",
        body: "Copenhagen welcomed over 10 million overnight tourists in 2023, straining Nyhavn, the Little Mermaid, and Tivoli Gardens. City managers introduced tourist taxes and visitor caps in 2024, but locals report feeling displaced from their own waterfront.",
        valence: "bad",
      },
    ],

    // Stage 11 - Housing BOSS 3/5
    [
      {
        kind: "house",
        title: "High-Quality Housing Stock",
        body: "Over 97% of Copenhagen dwellings meet EU minimum quality standards for sanitation, heating, and structural integrity (Eurostat 2023). The city's co-housing ('bofællesskaber') movement, with over 700 intentional communities, offers an internationally cited affordable model.",
        valence: "good",
      },
      {
        kind: "crane",
        title: "Social Housing at 20%",
        body: "Roughly 20% of Copenhagen's housing is social ('almene boliger'), managed by non-profit housing associations. The waiting list system gives long-term residents priority, and rents are capped below market rates - a key affordability buffer.",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "Prices Rose 60% in Decade",
        body: "Copenhagen apartment prices increased approximately 60% in real terms between 2013 and 2023 (Boliga data), making the city one of Northern Europe's least affordable for first-time buyers. A 100 m² apartment in Frederiksberg averaged DKK 6.2 million (~€830,000) in 2024.",
        valence: "bad",
      },
      {
        kind: "house",
        title: "Rental Market Frozen",
        body: "Strict rent control on pre-1991 housing stock has created a dual market: controlled rents far below market for lucky incumbents, and unaffordable free-market rents for newcomers. Average wait for a social housing unit in Copenhagen exceeded 10 years in 2023.",
        valence: "bad",
      },
    ],
  ],

  // ─────────────────────────────────────────────
  // TORONTO  (difficulty 0.45)
  // ─────────────────────────────────────────────
  toronto: [
    // Stage 1 - Arts, Culture & Recreation 5/5
    [
      {
        kind: "temple",
        title: "Most Diverse City",
        body: "Toronto is frequently cited as the world's most ethnically diverse city: over 51% of residents were born outside Canada (2021 Census). This produces one of earth's densest concentrations of cuisines, festivals, and cultural institutions - over 200 languages are spoken daily.",
        valence: "good",
      },
      {
        kind: "plaque",
        title: "TIFF & AGO Anchors",
        body: "The Toronto International Film Festival (TIFF) generates an estimated CAD 189 million in economic activity each September and has launched Oscar campaigns for over 40 years. The Art Gallery of Ontario (AGO), redesigned by Frank Gehry in 2008, holds 120,000 works.",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "Live Music Venue Crisis",
        body: "Toronto lost over 30 independent music venues between 2018 and 2023, as rising rents and post-pandemic debt forced closures. The 2023 Music Venue Task Force found average monthly rent for a 300-capacity venue exceeded CAD 25,000 - unworkable for most operators.",
        valence: "bad",
      },
      {
        kind: "dollar",
        title: "Raptors Ticket Prices Soar",
        body: "Average resale NBA Raptors ticket prices at Scotiabank Arena reached CAD 310 in 2023–24, up 58% since 2019. Cultural gatekeeping through cost is a concern: surveys show low-income families increasingly cannot afford professional sports or theatre.",
        valence: "bad",
      },
    ],

    // Stage 2 - Learning 4/5
    [
      {
        kind: "school",
        title: "U of T: Top-20 Global",
        body: "The University of Toronto ranked 21st in the QS World University Rankings 2024, its highest-ever placement, and leads North America in AI and immunology research. The Toronto academic corridor (U of T, Ryerson/TMU, York) enrols over 200,000 students.",
        valence: "good",
      },
      {
        kind: "book",
        title: "High Immigrant Education",
        body: "Canada's 'human capital' immigration points system means 57% of Toronto's recent immigrants hold a university degree (Statistics Canada 2021), lifting average education levels citywide and fuelling innovation districts like the MaRS Discovery District.",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "University Tuition Frozen-Low",
        body: "Ontario froze domestic undergraduate tuition at 2019 levels until 2024 - a boon for students but creating a funding gap: universities reported combined deficits of CAD 450 million in 2022–23, cutting library hours, sessional staff, and student services.",
        valence: "bad",
      },
      {
        kind: "school",
        title: "Deep School Inequality",
        body: "Toronto's Education Quality and Accountability Office (EQAO) 2023 data shows Grade 6 math proficiency ranging from 90% in wealthy North York neighbourhoods to under 40% in Scarborough's priority schools - a direct reflection of household income and housing segregation.",
        valence: "bad",
      },
    ],

    // Stage 3 - Work 4/5
    [
      {
        kind: "factory",
        title: "Finance & Tech Cluster",
        body: "Toronto is Canada's financial capital and North America's 3rd-largest financial centre by employment. The city's tech sector added 80,000 jobs between 2019 and 2023 (CBRE Tech Talent Report), with firms like Google, Microsoft, and Shopify maintaining major offices.",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "Strong Minimum Wage",
        body: "Ontario's general minimum wage rose to CAD 17.20/hour in October 2024 - one of Canada's highest provincial floors. The living wage in Toronto, independently calculated by the Ontario Living Wage Network, is CAD 23.15/hour (2024).",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "Tech Layoffs Hit Hard",
        body: "Toronto's tech sector shed an estimated 25,000 positions in 2022–23 as global firms including Shopify, Twitter/X, and Lyft executed major layoffs. Many workers on Employer-Specific Work Permits faced deportation risk, exposing structural vulnerabilities in Canada's labour system.",
        valence: "bad",
      },
      {
        kind: "factory",
        title: "Credential Recognition Gap",
        body: "A 2023 Ryerson City Building Institute report found 28% of Toronto immigrants with foreign professional credentials are working in jobs unrelated to their training - a 'brain waste' costing the Ontario economy an estimated CAD 13 billion annually in lost productivity.",
        valence: "bad",
      },
    ],

    // Stage 4 - Civic Engagement 4/5
    [
      {
        kind: "vote",
        title: "Strong NGO Ecosystem",
        body: "Toronto hosts over 5,000 registered charities and non-profits - one of North America's densest civic societies per capita (CRA 2023). Organisations like the Toronto Community Benefits Network successfully negotiated local-hire clauses into the Eglinton Crosstown LRT contract.",
        valence: "good",
      },
      {
        kind: "flag",
        title: "Diverse City Council",
        body: "Following the 2022 municipal election, Toronto City Council became one of Canada's most diverse: 47% of councillors identify as women or non-binary, and 38% are racialized - up from 24% in 2018, better reflecting the city's population.",
        valence: "good",
      },
      {
        kind: "vote",
        title: "Low Mayoral Turnout",
        body: "Toronto's 2023 mayoral by-election recorded only 29.5% turnout - the lowest for a Toronto mayoral race in the modern era. Chronic underfunding of civic education, long working hours, and poor ward accessibility contribute to disengagement.",
        valence: "bad",
      },
      {
        kind: "flag",
        title: "Province Overrides Council",
        body: "In 2018 the Ontario government mid-election cut Toronto City Council from 47 to 25 seats, using the notwithstanding clause after a court found it unconstitutional. This intervention deepened distrust in provincial-municipal relations and remains a flashpoint.",
        valence: "bad",
      },
    ],

    // Stage 5 - Health 4/5
    [
      {
        kind: "hospital",
        title: "World-Class Hospital Network",
        body: "Toronto's University Health Network (UHN) - including Toronto General, Toronto Western, and Princess Margaret - ranks among the top 10 hospital systems globally (Newsweek 2024). SickKids Hospital leads in paediatric oncology research, attracting patients from 100+ countries.",
        valence: "good",
      },
      {
        kind: "bike",
        title: "Longest Life Expectancy",
        body: "Toronto Census Metropolitan Area has the highest life expectancy of any major Canadian metro: 83.1 years (Statistics Canada 2022), attributed to high immigrant 'healthy newcomer effect,' dense primary care, and relatively strong air quality for a large city.",
        valence: "good",
      },
      {
        kind: "hospital",
        title: "ER Wait Crisis",
        body: "Ontario's ERs hit record overcrowding in 2022–23: hospital occupancy averaged 109% province-wide and Toronto sites reported patients waiting 18+ hours on corridor beds. A nursing shortage of roughly 12,000 RNs province-wide drives much of the strain.",
        valence: "bad",
      },
      {
        kind: "dollar",
        title: "Mental Health Gap",
        body: "Over 100,000 Ontarians were on wait lists for publicly funded mental health services in 2023 (CAMH). Average wait for an outpatient psychiatry appointment at Toronto's CAMH reached 6 months; many patients turn to expensive private therapy averaging CAD 200/session.",
        valence: "bad",
      },
    ],

    // Stage 6 - Safety 4/5
    [
      {
        kind: "flag",
        title: "Safer Than Peer Cities",
        body: "Toronto's homicide rate was 1.8 per 100,000 in 2023 (Toronto Police), far below Chicago (18.3), New York (4.1), and Los Angeles (7.1). The Economist Safe Cities Index 2021 ranked Toronto 8th globally - the only North American city in the top 10.",
        valence: "good",
      },
      {
        kind: "hospital",
        title: "Community Safety Programs",
        body: "Toronto's Situation Table model - now operating in 14 city divisions - brings police, social workers, and health providers together to rapidly intervene with high-risk individuals. A 2022 evaluation found it reduced acute crisis incidents by 65% among participants.",
        valence: "good",
      },
      {
        kind: "car",
        title: "Auto Theft Epidemic",
        body: "Toronto recorded 12,861 auto thefts in 2023 - a 25-year high, costing insurers over CAD 1 billion. Organized crime rings export stolen vehicles via Port of Montreal; Ontario's average auto insurance premium hit CAD 1,920/year, highest in Canada.",
        valence: "bad",
      },
      {
        kind: "dollar",
        title: "Gun Violence Concentrated",
        body: "While overall crime is moderate, gun violence is heavily concentrated: in 2022, 14 Toronto neighbourhoods accounted for 72% of all shooting incidents (Toronto Police). Most victims and perpetrators are young Black men, reflecting intersecting inequalities in housing and opportunity.",
        valence: "bad",
      },
    ],

    // Stage 7 - State of the Sector 4/5
    [
      {
        kind: "flag",
        title: "Stable Federal Governance",
        body: "Canada ranked 13th on the EIU Democracy Index 2023, and Toronto benefits from federal immigration, healthcare, and infrastructure transfers totalling CAD 4.6 billion annually. Transparency International gave Canada a score of 76/100 in 2023.",
        valence: "good",
      },
      {
        kind: "temple",
        title: "Toronto Water Award",
        body: "Toronto Water won the American Water Works Association's 2023 Best Utility award for operational excellence. The city's drinking water consistently meets or exceeds WHO standards, with 100% compliance in 2022 tests across all 4 treatment plants.",
        valence: "good",
      },
      {
        kind: "crane",
        title: "Transit Funding Gaps",
        body: "The Eglinton Crosstown LRT - originally budgeted at CAD 5.3 billion - is expected to cost over CAD 12 billion by completion, delayed past 2024. Ontario Infrastructure Ontario attributed the overrun to contractor disputes and pandemic disruptions, but accountability has been widely criticised.",
        valence: "bad",
      },
      {
        kind: "dollar",
        title: "Homelessness Service Failure",
        body: "Toronto spent CAD 711 million on homelessness services in 2023 but reported a record 10,000+ people sleeping in shelters or outside each night (City of Toronto). The system is structured around emergency response rather than housing-first prevention.",
        valence: "bad",
      },
    ],

    // Stage 8 - Income and Wealth 4/5
    [
      {
        kind: "dollar",
        title: "Median Household: CAD 84K",
        body: "Toronto Census Metropolitan Area median household income reached CAD 84,000 in 2021 (Statistics Canada), above the national median of CAD 73,000. Tech, finance, and health-sector salaries push average wages well above the national mean.",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "Progressive Tax System",
        body: "Canada's combined federal-provincial top marginal rate in Ontario reaches 53.5% - funding universal healthcare, EI, and CPP. Refundable tax credits (GST Credit, Canada Child Benefit) redistribute significantly to low-income families with children.",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "Gini Rising Sharply",
        body: "Toronto's after-tax Gini coefficient rose from 0.37 to 0.43 between 2000 and 2022 (Statistics Canada), driven by housing wealth concentration. The wealthiest 1% of Torontonians held 17% of total income in 2021 - the highest share of any Canadian metro.",
        valence: "bad",
      },
      {
        kind: "house",
        title: "Poverty Rate Hits 19%",
        body: "Using Statistics Canada's Market Basket Measure, 19.1% of Toronto residents lived in poverty in 2022 - above the national rate of 9.9%. Food bank use set a record in 2023: Daily Bread and North York Harvest together served 300,000 unique clients.",
        valence: "bad",
      },
    ],

    // Stage 9 - Environment 3/5
    [
      {
        kind: "leaf",
        title: "Ravine System Protected",
        body: "Toronto's 11,000+ hectares of ravine valley land - the largest urban ravine system in North America - are protected from development under the Ravine and Natural Feature Protection By-law (2017). They act as flood mitigation, carbon sinks, and biodiversity corridors.",
        valence: "good",
      },
      {
        kind: "solar",
        title: "TransformTO Net-Zero",
        body: "Toronto's TransformTO strategy targets net-zero emissions by 2040. By 2022, the city had cut community-wide emissions 34% below 1990 levels, ahead of schedule, driven largely by Ontario's low-carbon electricity grid (89% non-emitting in 2023).",
        valence: "good",
      },
      {
        kind: "car",
        title: "Urban Heat Island Severe",
        body: "Toronto's urban heat island raises downtown temperatures 4–6°C above surrounding rural areas in summer (Environment and Climate Change Canada 2022). The July 2024 heat event saw 36 heat-related deaths in the city, concentrated among low-income renters without AC.",
        valence: "bad",
      },
      {
        kind: "smog",
        title: "Traffic PM2.5 Persists",
        body: "Despite cleaner electricity, transportation accounts for 35% of Toronto's total GHG emissions (City of Toronto 2023). Annual average PM2.5 concentrations near the Gardiner Expressway regularly exceed the WHO 2021 guideline of 5 μg/m³, contributing to respiratory disease.",
        valence: "bad",
      },
    ],

    // Stage 10 - Getting Around 3/5
    [
      {
        kind: "metro",
        title: "Eglinton LRT Expanding",
        body: "The Eglinton Crosstown LRT - 19 km of mostly underground rail across midtown Toronto - will add 25 stations and is expected to carry 5,400 passengers per hour at peak once open. Combined with the Ontario Line, it represents CAD 28 billion in regional transit investment.",
        valence: "good",
      },
      {
        kind: "bike",
        title: "Bike Share: 9,000 Bikes",
        body: "Toronto Bike Share operates 9,000+ bikes across 850 stations (2024), making it Canada's largest system and one of North America's top 5 by fleet size. Annual memberships cost CAD 99, and usage reached 7.2 million rides in 2023.",
        valence: "good",
      },
      {
        kind: "car",
        title: "Worst Congestion in N. America",
        body: "TomTom's 2023 Traffic Index ranked Toronto the most congested city in North America: drivers lost an average of 118 hours to traffic delays per year. The city has one of the lowest per-capita public transit funding levels among major OECD cities.",
        valence: "bad",
      },
      {
        kind: "metro",
        title: "TTC Reliability Crisis",
        body: "The TTC reported 14,000+ subway delays in 2022, many caused by aging signal equipment, some more than 70 years old. A 2023 TTC capital plan identified CAD 33 billion in state-of-good-repair needs over 15 years - a backlog built over decades of underfunding.",
        valence: "bad",
      },
    ],

    // Stage 11 - Housing BOSS 2/5
    [
      {
        kind: "house",
        title: "Condo Supply Growing",
        body: "Toronto had over 92,000 condo units under construction in 2023 - the most of any city in North America (Urbanation). This supply pipeline, concentrated along transit corridors, represents the largest single-city residential construction effort in Canadian history.",
        valence: "good",
      },
      {
        kind: "crane",
        title: "Missing Middle Reforms",
        body: "In 2022 Toronto became the first major North American city to allow four-plexes as-of-right across all residential land, removing the need for individual rezoning applications. The federal Housing Accelerator Fund added CAD 471 million to incentivise faster approvals.",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "Benchmark Price: CAD 1.1M",
        body: "The Toronto Regional Real Estate Board benchmark home price hit CAD 1,106,000 in early 2024 - roughly 12 times the median household income. Only about 42% of Toronto households own their home, down from 53% in 2011, as ownership has become inaccessible for most.",
        valence: "bad",
      },
      {
        kind: "house",
        title: "Rent Up 33% in 3 Years",
        body: "Average one-bedroom rents in Toronto reached CAD 2,640/month in Q1 2024 (Urbanation), a 33% increase from 2021. Evictions at the Landlord and Tenant Board hit a record 32,000 applications in 2023, as landlords pursue 'renovictions' and above-guideline increases.",
        valence: "bad",
      },
    ],
  ],

  // ─────────────────────────────────────────────
  // ISTANBUL  (difficulty 0.62)
  // ─────────────────────────────────────────────
  istanbul: [
    // Stage 1 - Arts, Culture & Recreation 5/5
    [
      {
        kind: "temple",
        title: "3 UNESCO World Heritage Sites",
        body: "Istanbul is one of only two cities in the world with UNESCO World Heritage Sites on both sides of an intercontinental boundary (Historic Areas of Istanbul, inscribed 1985). Its 4,000+ years of continuous habitation have left the world's densest concentration of Byzantine and Ottoman monuments.",
        valence: "good",
      },
      {
        kind: "market",
        title: "Grand Bazaar: 30,000/day",
        body: "The Kapalıçarşı (Grand Bazaar), established in 1461, covers 30,600 m² with 4,000 shops and draws roughly 30,000 daily visitors. It is consistently rated one of the world's most-visited tourist attractions, generating over USD 300 million in annual trade.",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "Tourism Crowding Crisis",
        body: "Istanbul welcomed 20.2 million international tourists in 2023, overwhelming the Hagia Sophia (now a mosque), Topkapi Palace, and Sultanahmet quarter. Residents report being displaced from their own historic neighbourhoods by souvenir shops and Airbnb conversions.",
        valence: "bad",
      },
      {
        kind: "smog",
        title: "Heritage Under Pollution",
        body: "Stone monuments in Sultanahmet and Eyüp show accelerating weathering from NO₂ and particulate deposition, documented by Istanbul Technical University (2022). Conservation budgets were cut 18% in real terms between 2019 and 2023 due to Turkey's fiscal constraints.",
        valence: "bad",
      },
    ],

    // Stage 2 - Civic Engagement 3/5
    [
      {
        kind: "vote",
        title: "High Electoral Turnout",
        body: "Turkey's 2023 presidential and parliamentary elections saw 87% voter turnout - among the highest in the world for a competitive election. Istanbul's municipal services have improved under Mayor Ekrem İmamoğlu (elected 2019), boosting local civic confidence.",
        valence: "good",
      },
      {
        kind: "flag",
        title: "Neighbourhood Associations Active",
        body: "Istanbul's 'muhtarlık' system (elected neighbourhood headmen) provides hyper-local civic representation across 970 neighbourhoods. Muhtars assist residents with official documents, mediating between communities and the large metropolitan municipality.",
        valence: "good",
      },
      {
        kind: "flag",
        title: "Press Freedom Restricted",
        body: "Turkey ranked 158th out of 180 countries on RSF's 2024 World Press Freedom Index. More than 90% of national media is owned by government-aligned conglomerates; critical Istanbul journalists face defamation suits and travel bans, chilling public discourse.",
        valence: "bad",
      },
      {
        kind: "vote",
        title: "Mayor Faces Criminal Charges",
        body: "İstanbul Mayor İmamoğlu was convicted in 2022 of 'insulting public officials' in a case widely seen as politically motivated; a retrial continued through 2024. The case exemplifies the blurring of judicial and executive power that undermines institutional trust.",
        valence: "bad",
      },
    ],

    // Stage 3 - Learning 3/5
    [
      {
        kind: "school",
        title: "Istanbul Technical University",
        body: "Istanbul Technical University (ITU), founded 1773, is Turkey's leading STEM institution and ranks in the top 500 globally (QS 2024). Istanbul hosts 50+ universities enrolling over 600,000 students - making it one of Europe's largest university cities by student population.",
        valence: "good",
      },
      {
        kind: "book",
        title: "Literacy Rate 97%",
        body: "Turkey's adult literacy rate reached 97.4% in 2022 (UNESCO), up from 72% in 1980, reflecting decades of compulsory education expansion. Istanbul's literacy rate is effectively 99%+, driven by its large graduate and white-collar population.",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "University Entrance Bottleneck",
        body: "Turkey's university entrance exam (YKS) is taken by 3.5 million candidates annually for about 1.2 million first-year places. Private 'dershane' tutoring costs can reach TRY 120,000/year (~USD 4,000 at 2024 rates), widening the gap between rich and poor students.",
        valence: "bad",
      },
      {
        kind: "book",
        title: "Academic Freedom Curtailed",
        body: "Following the 2016 coup attempt, over 6,000 academics were dismissed from Turkish universities under emergency decrees; many remain banned from employment in their field (Scholars at Risk 2023). Self-censorship in social sciences and humanities is widely reported.",
        valence: "bad",
      },
    ],

    // Stage 4 - Getting Around 3/5
    [
      {
        kind: "ferry",
        title: "Bosphorus Ferries Iconic",
        body: "İDO and Şehir Hatları operate over 180,000 passenger ferry trips annually across the Bosphorus and Sea of Marmara. Istanbul's sea transport network is the largest urban ferry system in Europe by passenger numbers, carrying roughly 150,000 daily commuters.",
        valence: "good",
      },
      {
        kind: "metro",
        title: "Metro Network Expanding",
        body: "Istanbul's metro system reached 246 km of track on 13 lines in 2024 - a near-doubling since 2013. By 2030 the city aims for 400 km, which would place it among the world's 10 longest metro networks, connecting both the European and Asian sides.",
        valence: "good",
      },
      {
        kind: "car",
        title: "15-Million-Person Gridlock",
        body: "With 15+ million residents and over 5 million registered vehicles, Istanbul's roads are among the world's most congested. TomTom's 2023 Traffic Index ranked Istanbul 2nd globally: drivers lost an average of 142 hours per year to traffic - about 6 full days.",
        valence: "bad",
      },
      {
        kind: "car",
        title: "Bosphorus Bridge Choke Points",
        body: "The two Bosphorus suspension bridges (Fatih Sultan Mehmet and 15 Temmuz Şehitler) funnel cross-continental traffic through bottlenecks that cause daily multi-hour tailbacks. The Eurasia Tunnel (opened 2016) provided relief, but its CAD 4 toll excludes many commuters.",
        valence: "bad",
      },
    ],

    // Stage 5 - Housing 3/5
    [
      {
        kind: "house",
        title: "Relatively Affordable vs West",
        body: "Istanbul apartment prices averaged TRY 12 million (~USD 380,000 at 2024 rates) in 2024 - less than half London or Copenhagen prices in USD terms. A large rental market, particularly in inner-city Beyoğlu and Kadıköy, offers furnished apartments from ~USD 600/month.",
        valence: "good",
      },
      {
        kind: "crane",
        title: "Urban Renewal Drive",
        body: "Turkey's 2012 Law 6306 enabled mass demolition and rebuilding of earthquake-risk structures, replacing over 200,000 Istanbul units with seismically reinforced buildings by 2023. The programme, while controversial for displacement, has improved structural safety significantly.",
        valence: "good",
      },
      {
        kind: "house",
        title: "Inflation Erodes Affordability",
        body: "Turkish CPI inflation peaked at 85% in October 2022 and remained above 60% in 2024. Istanbul rents rose 150–200% in nominal terms between 2021 and 2024, while wage growth lagged significantly - causing acute housing affordability stress even where prices were once modest.",
        valence: "bad",
      },
      {
        kind: "smog",
        title: "Earthquake Risk: 70% Probability",
        body: "Scientists estimate a 70% probability of a magnitude 7+ earthquake striking Istanbul by 2040 (AFAD 2022). Up to 60,000 buildings in the city are classified as high-risk; the 2023 Kahramanmaraş earthquake (50,000+ deaths) intensified public urgency about the unprepared housing stock.",
        valence: "bad",
      },
    ],

    // Stage 6 - Work 3/5
    [
      {
        kind: "factory",
        title: "Turkey's Economic Engine",
        body: "Istanbul generates approximately 31% of Turkey's total GDP and 40% of its tax revenue (TurkStat 2023) despite holding 18% of the population. The city hosts Turkey's top 500 companies, the Istanbul Stock Exchange (Borsa İstanbul), and major logistics hubs.",
        valence: "good",
      },
      {
        kind: "market",
        title: "Tourism Employment Boom",
        body: "The tourism industry directly employs over 500,000 people in Istanbul, from hotels and restaurants to guides and artisans. After COVID-19 wiped out millions of tourism jobs, a record 2023 recovery brought employment back above pre-pandemic levels.",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "Real Wage Collapse",
        body: "Turkish real wages fell approximately 30% in purchasing-power terms between 2021 and 2023 as inflation outpaced salary increases. Minimum wage, though raised from TRY 4,253 to TRY 20,002/month in 2024, still failed to keep up with food and rent inflation.",
        valence: "bad",
      },
      {
        kind: "factory",
        title: "Informal Labour: 30%",
        body: "Approximately 30% of Istanbul's workforce is employed in the informal sector - unregistered, without social security, and outside labour protections (TurkStat 2023). This includes many Syrian refugees (600,000+ in Istanbul) who lack work permits.",
        valence: "bad",
      },
    ],

    // Stage 7 - Health 3/5
    [
      {
        kind: "hospital",
        title: "Medical Tourism Leader",
        body: "Istanbul attracted over 1.2 million medical tourists in 2023, ranking it 4th globally by patient volume (Medical Tourism Index). State-of-the-art private hospitals like Acıbadem and Memorial offer procedures at 30–70% below Western European prices with comparable outcomes.",
        valence: "good",
      },
      {
        kind: "hospital",
        title: "City Hospitals Mega-Project",
        body: "Turkey built 9 'şehir hastaneleri' (city hospitals) between 2017 and 2023, including the 2,682-bed Başakşehir Çam ve Sakura Hospital - the world's largest hospital complex. These facilities dramatically expanded Istanbul's public hospital capacity.",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "Healthcare Two-Tier System",
        body: "Private hospitals charge 5–15x more than SGK (social security) reimbursement rates, meaning uninsured or informally employed patients - a large share of the workforce - face catastrophic out-of-pocket costs. Only 68% of Istanbul residents hold active SGK coverage (Ministry of Health 2022).",
        valence: "bad",
      },
      {
        kind: "smog",
        title: "Air Pollution & Lung Disease",
        body: "Istanbul's annual PM2.5 average reached 22 μg/m³ in 2022 (WHO database) - more than four times the WHO guideline of 5 μg/m³. Respiratory disease is the 3rd leading cause of hospital admissions in the city, disproportionately affecting children in high-traffic districts.",
        valence: "bad",
      },
    ],

    // Stage 8 - Safety 3/5
    [
      {
        kind: "flag",
        title: "Low Homicide Rate",
        body: "Turkey's homicide rate was 2.6 per 100,000 in 2022 - well below the global average of 6.0 (UNODC). Istanbul, despite its size, recorded fewer than 200 homicides in 2022, a rate comparable to major Western European cities.",
        valence: "good",
      },
      {
        kind: "flag",
        title: "Earthquake Preparedness Drills",
        body: "Istanbul runs annual city-wide earthquake preparedness drills involving over 1 million residents, schools, and businesses. AFAD (Disaster and Emergency Management Presidency) has established 200+ logistics warehouses stocked for post-earthquake relief within the metropolitan boundary.",
        valence: "good",
      },
      {
        kind: "flag",
        title: "Geopolitical Security Incidents",
        body: "Istanbul experienced three significant terror attacks between 2015 and 2022, including the January 2016 Sultanahmet bombing (12 killed) and the October 2022 İstiklal Avenue bombing (6 killed). Regional instability from Syria and Ukraine sustains elevated threat perceptions.",
        valence: "bad",
      },
      {
        kind: "car",
        title: "Road Deaths: 6,500/yr in Turkey",
        body: "Turkey recorded 6,529 road fatalities in 2022 (TUIK), one of the highest rates per capita in the OECD at 7.8 per 100,000. Istanbul accounts for roughly 15% of national traffic deaths; pedestrian fatalities on major arterials are a persistent safety failure.",
        valence: "bad",
      },
    ],

    // Stage 9 - State of the Sector 3/5
    [
      {
        kind: "temple",
        title: "G20 Economy & NATO Member",
        body: "Turkey is a G20 economy and NATO member, giving Istanbul global diplomatic and commercial significance. The city hosts 105 consulates-general - more than any other city outside capitals - underpinning its role as a regional business hub.",
        valence: "good",
      },
      {
        kind: "flag",
        title: "IMM Green Bond 2021",
        body: "Istanbul Metropolitan Municipality issued Turkey's first green municipal bond (€75 million, 2021) to fund sustainable transport and energy projects, demonstrating capacity to access international capital markets even under sovereign fiscal stress.",
        valence: "good",
      },
      {
        kind: "flag",
        title: "Corruption Perceptions: 34/100",
        body: "Turkey scored 34/100 on Transparency International's Corruption Perceptions Index 2023, placing it 115th out of 180 countries. Procurement irregularities in construction contracts and public-private hospital PPPs have attracted repeated audit findings.",
        valence: "bad",
      },
      {
        kind: "dollar",
        title: "Central Bank Independence Lost",
        body: "Between 2019 and 2021 President Erdoğan dismissed three Central Bank governors who resisted unorthodox low-rate policy. The resulting lira collapse undermined fiscal planning at every level of government, including Istanbul's ability to service foreign-currency debts.",
        valence: "bad",
      },
    ],

    // Stage 10 - Environment 2/5
    [
      {
        kind: "drop",
        title: "Bosphorus Coastline Asset",
        body: "Istanbul's 580 km of coastline along the Bosphorus, Golden Horn, Marmara Sea, and Black Sea provides unique ecological corridors and coastal park access. The IMM Coastal Cleanup Program removed over 2,000 tonnes of marine litter from Istanbul shores in 2022.",
        valence: "good",
      },
      {
        kind: "leaf",
        title: "Belgrad Forest Protected",
        body: "The 5,500-hectare Belgrad Forest on Istanbul's European fringe is the city's largest public green space and a critical drinking-water catchment. It has been formally protected from development since 1994, serving 3 million recreational visits annually.",
        valence: "good",
      },
      {
        kind: "smog",
        title: "Sea of Marmara Mucilage",
        body: "In 2021 the Sea of Marmara was blanketed by a historic outbreak of 'sea snot' (marine mucilage), caused by excessive nutrient runoff from Istanbul's inadequate sewage treatment. The die-off of sea life devastated fishing and tourism and remains a recurring threat.",
        valence: "bad",
      },
      {
        kind: "factory",
        title: "Industrial Air Pollution",
        body: "Istanbul's Tuzla and Başakşehir industrial zones contribute substantially to annual SO₂ and PM10 exceedances. The city exceeded the EU annual PM10 limit value of 40 μg/m³ on over 35 days in 2022, linked to an estimated 3,500 premature deaths (EEA methodology).",
        valence: "bad",
      },
    ],

    // Stage 11 - Currency/Economy BOSS 2/5
    [
      {
        kind: "market",
        title: "Regional Trade Hub",
        body: "Istanbul handles roughly 40% of Turkey's exports and 60% of its imports by value. Its strategic position between Europe, Central Asia, and the Middle East gives it durable commercial relevance regardless of currency volatility.",
        valence: "good",
      },
      {
        kind: "factory",
        title: "Tech Start-Up Ecosystem",
        body: "Istanbul ranked 36th globally on the Startup Genome 2023 report, hosting over 3,000 active start-ups and attracting USD 728 million in venture capital in 2022. Fintech, e-commerce, and gaming sectors have achieved global exits including peak15-backed Trendyol (valued at USD 16.5 billion).",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "Lira Lost 80% vs USD",
        body: "The Turkish lira depreciated from 7 TRY/USD in 2020 to over 32 TRY/USD by early 2024 - an 80%+ collapse. USD-denominated rents, imports, and loan repayments caused severe real-income falls for households whose wages are paid in lira.",
        valence: "bad",
      },
      {
        kind: "dollar",
        title: "Inflation Peaked at 85%",
        body: "Turkish CPI inflation hit a 24-year high of 85.5% in October 2022, eroding savings and making long-term investment planning nearly impossible for businesses. Food inflation exceeded 100% in 2022, causing food-insecurity spikes among Istanbul's lower-income and refugee populations.",
        valence: "bad",
      },
    ],
  ],

  // ─────────────────────────────────────────────
  // BANGKOK  (difficulty 0.72)
  // ─────────────────────────────────────────────
  bangkok: [
    // Stage 1 - Arts, Culture & Recreation 5/5
    [
      {
        kind: "temple",
        title: "400+ Buddhist Temples",
        body: "Bangkok (Krung Thep Maha Nakhon) contains over 400 Buddhist wats, including Wat Phra Kaew (Temple of the Emerald Buddha, est. 1784) and Wat Arun (Temple of Dawn). These sacred spaces host free public festivals including Makha Bucha and Loy Krathong, drawing millions annually.",
        valence: "good",
      },
      {
        kind: "market",
        title: "Street Food Capital",
        body: "Bangkok's street food scene is globally iconic: CNN Travel named it the world's best street food city in 2023. An estimated 30,000 street food vendors operate citywide, with dishes averaging THB 40–80 (~USD 1–2), making quality food accessible across income levels.",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "Airbnb Kills Affordable Rentals",
        body: "Short-term rental platforms, technically illegal in Thailand but widely tolerated, converted over 20,000 Bangkok condos to tourist accommodation between 2019 and 2023 (AirDNA data). This reduced affordable long-term rental supply in central areas, pushing working residents to distant suburbs.",
        valence: "bad",
      },
      {
        kind: "smog",
        title: "Tourist Crush at Grand Palace",
        body: "The Grand Palace and Wat Phra Kaew complex receives over 8 million visitors annually, causing chronic crowding, heat-related illness incidents, and pressure on the surrounding Rattanakosin Island historic district. Entry fees rose to THB 500 in 2023 with no significant capacity management.",
        valence: "bad",
      },
    ],

    // Stage 2 - Housing 4/5
    [
      {
        kind: "house",
        title: "Condos Cheap vs Global Peers",
        body: "A 60 m² condominium in Bangkok's inner suburbs averaged THB 3.5 million (~USD 97,000) in 2023 (CBRE Thailand), making Bangkok one of Southeast Asia's most affordable major cities for mid-market condo ownership. Expat-friendly leasehold structures are well-established.",
        valence: "good",
      },
      {
        kind: "crane",
        title: "BTS Corridor Development",
        body: "Transit-Oriented Development around BTS Skytrain stations has produced concentrated, walkable condominium clusters in Thonglor, Ekkamai, and Udom Suk. Real estate along BTS lines appreciated 25–35% between 2018 and 2023, creating equity gains for early buyers.",
        valence: "good",
      },
      {
        kind: "drop",
        title: "120,000 Flood-Risk Homes",
        body: "Over 120,000 Bangkok homes lie in zones classified as high flood risk (Bangkok Metropolitan Administration 2023). The 2011 mega-flood inundated 800 km² of the metropolitan area for up to 2 months, causing USD 45 billion in total damages - Thailand's costliest disaster on record.",
        valence: "bad",
      },
      {
        kind: "house",
        title: "Slum Dwellers: 1 Million",
        body: "An estimated 1 million Bangkok residents live in informal settlements or 'chumchon ae-at' (crowded communities), often on canal edges or under expressways, with insecure land tenure. The National Housing Authority estimates a backlog of 400,000 affordable housing units nationwide.",
        valence: "bad",
      },
    ],

    // Stage 3 - Income and Wealth 3/5
    [
      {
        kind: "dollar",
        title: "Low Cost of Living",
        body: "Bangkok's cost of living ranks consistently 50–60% below comparable world cities for food, transport, and utilities (Numbeo 2024). The monthly budget for a comfortable single-person lifestyle averages THB 25,000–35,000 (~USD 700–1,000), attracting remote workers worldwide.",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "Minimum Wage Raised 2024",
        body: "Thailand's national minimum wage rose to THB 400/day (~USD 11) in January 2024 - the largest single increase in a decade - after sustained labour advocacy. Bangkok's higher living costs led its provincial board to set a local rate of THB 400, up from THB 353 in 2022.",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "Gini Coefficient: 0.43",
        body: "Thailand's Gini coefficient stands at 0.43 (World Bank 2021), one of ASEAN's highest inequality measures. The wealthiest 1% of Thais own approximately 67% of total wealth (Credit Suisse Global Wealth Report 2022), with wealth especially concentrated in Bangkok families.",
        valence: "bad",
      },
      {
        kind: "factory",
        title: "Capital Leaks from Provinces",
        body: "Bangkok generates roughly 40% of Thailand's GDP while holding 17% of its population, drawing migrants from impoverished Northeast (Isan) and North regions. Remittances flow backwards but structural investment remains concentrated in Bangkok, perpetuating regional inequality.",
        valence: "bad",
      },
    ],

    // Stage 4 - Work 3/5
    [
      {
        kind: "factory",
        title: "ASEAN Business Hub",
        body: "Bangkok hosts the ASEAN Secretariat and over 3,000 multinational company regional headquarters. Thailand's Board of Investment approved THB 688 billion (~USD 19 billion) in new investment applications in 2023, with Bangkok-area electronics and automotive the top recipients.",
        valence: "good",
      },
      {
        kind: "market",
        title: "Tourism: 20% of Economy",
        body: "Tourism directly contributes around 12–15% of Thailand's GDP, rising to nearly 20% when indirect effects are included. Bangkok's Suvarnabhumi Airport handled 51 million passengers in 2023, almost reaching pre-COVID peak, driving hospitality and retail employment recovery.",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "Wage Gap: Bangkok vs Rural",
        body: "Average monthly wages in Bangkok's formal sector (THB 22,000/month) are nearly double those in the poorest provinces (THB 11,500, NSO 2022). This drives massive rural-urban migration but overwhelms Bangkok's infrastructure and social services.",
        valence: "bad",
      },
      {
        kind: "factory",
        title: "55% Informal Employment",
        body: "Approximately 55% of Thailand's workforce is informally employed, with no labour protections, social security, or sick pay (ILO 2022). In Bangkok, informal street vendors, domestic workers, and construction labourers are particularly vulnerable - earning below minimum wage with no recourse.",
        valence: "bad",
      },
    ],

    // Stage 5 - Health 3/5
    [
      {
        kind: "hospital",
        title: "World-Class Private Hospitals",
        body: "Bangkok's Bumrungrad International Hospital treated over 1.3 million patients from 190+ countries in 2023, its highest-ever volume. Thailand's Joint Commission International (JCI)-accredited hospitals deliver cardiac surgery and oncology at 30–60% below US prices with comparable outcomes.",
        valence: "good",
      },
      {
        kind: "hospital",
        title: "30-Baht Universal Scheme",
        body: "Thailand's Universal Coverage Scheme (introduced 2002) covers 99% of citizens for a nominal co-pay of THB 30. The scheme is widely cited by WHO as a model for middle-income countries achieving near-universal health coverage at relatively low cost (~4% of GDP).",
        valence: "good",
      },
      {
        kind: "hospital",
        title: "Public Hospital Overcrowding",
        body: "Bangkok's public hospitals report average bed occupancy of 120–140% (Ministry of Public Health 2023). Ramathibodi and Siriraj hospitals regularly have patients on corridor beds; nurse-to-patient ratios in public wards often reach 1:20, well above WHO recommendations.",
        valence: "bad",
      },
      {
        kind: "smog",
        title: "Air Pollution Harms Health",
        body: "Bangkok's annual average PM2.5 reached 21 μg/m³ in 2023, over four times the WHO guideline. A Mahidol University 2022 study estimated Bangkok air pollution causes approximately 30,000 premature deaths per year in Thailand, with children and elderly most severely affected.",
        valence: "bad",
      },
    ],

    // Stage 6 - Learning 3/5
    [
      {
        kind:="school",
        title: "Chulalongkorn in Top 200",
        body: "Chulalongkorn University ranked 191st in the QS World University Rankings 2024, the highest-ranked Southeast Asian university outside Singapore. Bangkok hosts 80+ universities, and the city's tertiary enrolment ratio exceeds 60%, well above the Southeast Asian average.",
        valence: "good",
      },
      {
        kind: "book",
        title: "International School Boom",
        body: "Bangkok has over 180 international schools - more than any other Southeast Asian city - serving both expatriate and wealthy Thai families. Schools like NIST International, Bangkok Patana, and Ruamrudee follow Cambridge/IB curricula and achieve strong university placement rates.",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "Rural-Urban Quality Gap",
        body: "PISA 2022 revealed a 90-point gap in reading scores between Bangkok students and those in rural Thailand - roughly equivalent to two academic years. Access to qualified teachers in provincial schools is a chronic problem; approximately 30% of rural teaching positions are unfilled (OBEC 2023).",
        valence: "bad",
      },
      {
        kind: "book",
        title: "Overcrowded State Schools",
        body: "Bangkok state primary schools average 35–45 students per class (Bangkok Education Service Area Office 2023), well above the 25-student recommended maximum. Underfunding means ageing facilities, few specialist STEM teachers, and reliance on parents buying materials.",
        valence: "bad",
      },
    ],

    // Stage 7 - Civic Engagement 3/5
    [
      {
        kind: "vote",
        title: "2023 Election: 75% Turnout",
        body: "Thailand's May 2023 general election achieved 75% voter turnout, and the progressive Move Forward Party won the popular vote with 14.4 million votes - a record for a Thai opposition party. Youth civic energy was at a generational high point.",
        valence: "good",
      },
      {
        kind: "flag",
        title: "Neighbourhood Temple Networks",
        body: "Bangkok's Buddhist temple communities function as informal civic hubs: coordinating disaster relief, elderly care, and community events. During the COVID-19 pandemic, temples distributed over 10 million free meals to Bangkok's poor through organised volunteer networks.",
        valence: "good",
      },
      {
        kind: "flag",
        title: "Move Forward PM Blocked",
        body: "Despite winning the most seats, Move Forward leader Pita Limjaroenrat was blocked from becoming PM by the unelected 250-member Senate (a legacy of the 2017 military-drafted constitution). The Constitutional Court then dissolved Move Forward in August 2024, disillusioning millions of young voters.",
        valence: "bad",
      },
      {
        kind: "vote",
        title: "Lèse-Majesté Chills Protest",
        body: "Thailand's lèse-majesté law (Section 112) carries up to 15 years in prison per count. Between 2020 and 2023, over 200 activists were charged under the law, including students who displayed three-finger protest salutes. This severe legal risk suppresses civic participation and free speech.",
        valence: "bad",
      },
    ],

    // Stage 8 - State of the Sector 3/5
    [
      {
        kind: "temple",
        title: "Tourism Infrastructure Strong",
        body: "Thailand's Tourism Authority (TAT) managed a successful 2023 recovery, exceeding 28 million international arrivals. Airports, hospitality licensing, and visa-on-arrival systems operate smoothly; the 2024 visa exemption for Chinese nationals was implemented within 2 weeks of announcement.",
        valence: "good",
      },
      {
        kind: "crane",
        title: "Eastern Economic Corridor",
        body: "Thailand's Eastern Economic Corridor (EEC) - a special economic zone covering 3 provinces east of Bangkok - attracted USD 35 billion in investment commitments by 2023. The associated high-speed rail link (Bangkok to Pattaya) is under construction.",
        valence: "good",
      },
      {
        kind: "flag",
        title: "Corruption Index: 36/100",
        body: "Thailand scored 36/100 on Transparency International's 2023 CPI, ranking 108th globally. Police extortion, construction permit bribes, and procurement irregularities are well-documented by NACC investigations - though convictions of senior officials remain rare.",
        valence: "bad",
      },
      {
        kind: "dollar",
        title: "Military Budget Overhang",
        body: "Thailand's military received THB 222 billion (~USD 6.2 billion) in the 2024 budget - over 16% of discretionary government spending. Following multiple coups (2006, 2014), military-linked budget priorities have consistently outranked health, education, and public housing.",
        valence: "bad",
      },
    ],

    // Stage 9 - Safety 3/5
    [
      {
        kind: "flag",
        title: "Low Murder Rate for Size",
        body: "Bangkok's homicide rate was approximately 2.5 per 100,000 in 2022 (Royal Thai Police), low for a city of its size and density. Major tourist areas are heavily policed; tourist-targeted violent crime is statistically rare compared with Southeast Asian peers.",
        valence: "good",
      },
      {
        kind: "hospital",
        title: "Tourism Police Network",
        body: "Thailand's Tourist Police (established 1982) operate in English, Chinese, and other languages across Bangkok's major tourist districts. In 2022 they handled over 12,000 tourist assistance cases and have reduced foreigner robbery incidents by 40% since 2015.",
        valence: "good",
      },
      {
        kind: "car",
        title: "Road Deaths: 20,000/yr",
        body: "Thailand has one of the world's highest road fatality rates: approximately 20,000 deaths per year (WHO 2023), or 28 per 100,000 - more than 10x higher than the UK. Bangkok expressways and Songkran festival holidays are the deadliest periods; drunk driving is the leading cause.",
        valence: "bad",
      },
      {
        kind: "dollar",
        title: "Scam Industry Targets Tourists",
        body: "Bangkok's 'tuk-tuk gem scam' and 'closed temple' cons collectively defraud thousands of tourists annually; losses reported to Tourist Police exceeded THB 200 million in 2022. Online romance and investment scam syndicates operating from Myanmar border zones increasingly recruit victims via Bangkok.",
        valence: "bad",
      },
    ],

    // Stage 10 - Getting Around 3/5
    [
      {
        kind: "metro",
        title: "BTS & MRT: 130 km",
        body: "Bangkok's BTS Skytrain (55 km, 62 stations) and MRT Blue Line (55 km, 38 stations) together form a 130 km elevated/underground rail network that carried 1.4 million daily trips in 2023. Extensions in Samut Prakan and Nonthaburi pushed the network to its largest-ever footprint.",
        valence: "good",
      },
      {
        kind: "ferry",
        title: "Chao Phraya Boat Express",
        body: "The Chao Phraya Express Boat serves 34 piers along the city's main river artery, carrying over 100,000 passengers daily. Fares as low as THB 15 (USD 0.40) make it one of Bangkok's most affordable commuter options, and it avoids road congestion entirely.",
        valence: "good",
      },
      {
        kind: "car",
        title: "2nd Most Congested in SEA",
        body: "Bangkok ranked 2nd most congested city in Southeast Asia in TomTom's 2023 index: commuters lost an average of 64 hours to traffic per year. The motorway system was designed for fewer than 2 million vehicles; there are now over 10 million registered vehicles in the metro area.",
        valence: "bad",
      },
      {
        kind: "car",
        title: "Last-Mile Gap Persists",
        body: "Despite rail expansion, over 80% of Bangkok residents live more than 800 m from a BTS or MRT station (NESDC 2022). Heat, lack of pedestrian infrastructure, and absent feeder bus networks make non-car last-mile trips dangerous or impractical for most commuters.",
        valence: "bad",
      },
    ],

    // Stage 11 - Haze/Flood BOSS 2/5
    [
      {
        kind: "drop",
        title: "Canal Restoration Projects",
        body: "The Bangkok Metropolitan Administration's 2023 Canal Restoration Master Plan is refurbishing 60 km of klongs (canals) as combined flood channels and greenways. Klong Ong Ang's revival in 2020 - adding lighting, markets, and walkways - is cited as a model for urban canal regeneration.",
        valence: "good",
      },
      {
        kind: "leaf",
        title: "Lumpini Park Biodiversity",
        body: "Lumpini Park (57 ha, opened 1925) is Bangkok's green heart, hosting monitor lizards, over 100 bird species, and free public fitness facilities. The city's 2022 green space target of 10 m² per resident (up from 6.5 m²) commits to planting 1 million new trees by 2030.",
        valence: "good",
      },
      {
        kind: "smog",
        title: "Haze AQI Hits 'Hazardous'",
        body: "Bangkok's PM2.5 regularly reaches AQI >200 ('Very Unhealthy') during February–April, driven by agricultural burning in northern Thailand and vehicle emissions. In March 2023 the city recorded AQI 285 - 'Hazardous' - on multiple days, prompting school closures and mask mandates.",
        valence: "bad",
      },
      {
        kind: "drop",
        title: "Sinking 2 cm per Year",
        body: "Bangkok is sinking at an average rate of 2 cm per year due to groundwater extraction and the weight of buildings on soft alluvial clay (AIT 2022). Combined with 1 m of sea-level rise projected by 2100, up to 40% of greater Bangkok could be below sea level within decades.",
        valence: "bad",
      },
    ],
  ],

  // ─────────────────────────────────────────────
  // NEW DELHI  (difficulty 0.82)
  // ─────────────────────────────────────────────
  newdelhi: [
    // Stage 1 - Arts, Culture & Recreation 4/5
    [
      {
        kind: "temple",
        title: "3 UNESCO World Heritage Sites",
        body: "Delhi has 3 UNESCO World Heritage Sites within its borders: Qutub Minar (1193 CE), Humayun's Tomb (1570), and Red Fort Complex (1648). These monuments anchor a cultural landscape spanning 5,000+ years of continuous settlement across multiple empires.",
        valence: "good",
      },
      {
        kind: "plaque",
        title: "National Cultural Institutions",
        body: "New Delhi hosts India's premier national cultural institutions: the National Museum, National Gallery of Modern Art, Indira Gandhi National Centre for the Arts, and Sangeet Natak Akademi. The city's classical music and kathak dance scenes attract students from across South Asia.",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "Monument Access Inequity",
        body: "India charges foreign tourists USD 17 at the Red Fort and USD 15 at Qutb Minar - 75 times the ₹35 Indian national rate. While financially justified, the two-tier system creates de-facto segregation in public heritage spaces, and online booking excludes visitors without smartphones.",
        valence: "bad",
      },
      {
        kind: "smog",
        title: "Outdoor Culture Curtailed",
        body: "Delhi's extreme winter smog (AQI routinely >400 in November–January) cancels outdoor events and keeps residents indoors for weeks at a time. The Delhi government suspended outdoor sporting activities at schools on 38 days in the 2022–23 winter (DPCC data).",
        valence: "bad",
      },
    ],

    // Stage 2 - Learning 3/5
    [
      {
        kind: "school",
        title: "IITs & IIMs Nearby",
        body: "The Delhi-NCR region contains IIT Delhi (ranked 197 globally, QS 2024), IIM Ahmedabad's Delhi campus, and Jawaharlal Nehru University (JNU) - world-renowned for social sciences. Delhi University's 90 colleges form one of the world's largest residential university systems.",
        valence: "good",
      },
      {
        kind: "book",
        title: "Delhi Govt School Reform",
        body: "Between 2015 and 2022, the AAP government increased Delhi's education budget from 10% to 25% of total expenditure. 'School of Specialised Excellence' (SOSE) and 'Happiness Curriculum' programs drew international attention, with infrastructure upgrades reaching 1,000+ government schools.",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "Coaching Industry: ₹58,000 Cr",
        body: "India's private coaching (tutoring) industry was worth ₹58,700 crore (~USD 7 billion) in 2023, with Delhi-NCR as its hub. JEE coaching centres in Kota and Delhi charge ₹1–3 lakh per year, creating a two-tier system where exam success increasingly correlates with parental wealth.",
        valence: "bad",
      },
      {
        kind: "book",
        title: "Out-of-School Children Persist",
        body: "Despite progress, approximately 3 million children in Delhi-NCR remain out of school or are drop-outs, concentrated in migrant labour families (ASER 2023). Girl drop-out rates spike at secondary level in resettlement colonies, where menstruation-related absences are poorly addressed.",
        valence: "bad",
      },
    ],

    // Stage 3 - Work 3/5
    [
      {
        kind: "factory",
        title: "IT & Services Economy",
        body: "Delhi-NCR is India's 2nd-largest tech hub after Bengaluru, hosting Gurgaon's 'Millennium City' corridor with offices of Google, Microsoft, Adobe, and 50+ Fortune 500 firms. The NCR generated approximately USD 100 billion in services exports in fiscal year 2023.",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "Startup Ecosystem Growing",
        body: "Delhi-NCR had 11,000+ DPIIT-recognised startups and 9 unicorns (companies valued over USD 1 billion) as of 2023, including Paytm, InMobi, and Delhivery. Government incubation programs through Startup India supported over 2,000 Delhi-based ventures.",
        valence: "good",
      },
      {
        kind: "factory",
        title: "60% Informal Employment",
        body: "Approximately 60% of Delhi's workers are in the informal sector - street vendors, construction workers, domestic helpers - with no written contracts, social security, or sick leave (NSSO 2022). The pandemic wiped out 2.5 million informal jobs in Delhi in 2020, most of which returned only slowly.",
        valence: "bad",
      },
      {
        kind: "dollar",
        title: "Graduate Unemployment 12%",
        body: "India's graduate unemployment rate reached 12% nationally in 2023 (CMIE), with Delhi's educated unemployed concentrated in public-sector exam queues - hundreds of thousands apply for a handful of government positions. The mismatch between degree production and job creation is structural.",
        valence: "bad",
      },
    ],

    // Stage 4 - Civic Engagement 2/5
    [
      {
        kind: "vote",
        title: "High State Election Turnout",
        body: "Delhi's 2020 state assembly election saw 62.8% turnout - above average for an Indian city election. The competitive AAP vs. BJP political environment keeps civic interest high; Delhi's resident welfare associations (RWAs) are among India's most active urban civic bodies.",
        valence: "good",
      },
      {
        kind: "flag",
        title: "RTI Culture Strong",
        body: "Delhi's civil society has a robust culture of using the Right to Information Act (2005): Delhi accounts for 15–20% of all national RTI applications annually (CIC data). Activist groups like the Public Interest Litigation network have compelled pollution disclosures, ration shop audits, and budget accountability.",
        valence: "good",
      },
      {
        kind: "flag",
        title: "Bureaucratic Paralysis",
        body: "Delhi is governed by three overlapping authorities - Lt. Governor, AAP state government, and Municipal Corporation - that routinely conflict. In 2022–23, the Supreme Court and Parliament both ruled on Delhi governance disputes, leaving basic services like waste management stalled for months.",
        valence: "bad",
      },
      {
        kind: "vote",
        title: "Press Freedom Concerns",
        body: "India ranked 159th out of 180 on RSF's 2024 Press Freedom Index. Delhi-based journalists covering government schemes, land disputes, or minority communities increasingly report harassment, FIRs under sedition law, and in some cases physical threats.",
        valence: "bad",
      },
    ],

    // Stage 5 - Health 2/5
    [
      {
        kind: "hospital",
        title: "AIIMS: World-Class Hospital",
        body: "All India Institute of Medical Sciences (AIIMS) Delhi is ranked among Asia's top 10 hospitals and is the apex referral centre for India's 1.4 billion people. It performs over 1,500 complex surgeries monthly including heart, liver, and paediatric transplants, often at minimal cost.",
        valence: "good",
      },
      {
        kind: "hospital",
        title: "Mohalla Clinics: 1,000+",
        body: "Delhi's AAP government opened over 1,000 Mohalla Clinics (neighbourhood clinics) between 2015 and 2022, providing free consultations, 212 free medicines, and 38 free tests to 500,000+ patients monthly. WHO cited the model as an innovative primary care delivery approach.",
        valence: "good",
      },
      {
        kind: "hospital",
        title: "Doctor Deficit: 1 per 2,000",
        body: "Delhi has approximately 1 doctor per 2,000 residents in the public sector - well below the WHO recommended ratio of 1:1,000. AIIMS receives 10,000+ daily outpatient visits; patients from 20+ states queue from 3 AM for 6 AM appointments, reflecting extreme national primary care scarcity.",
        valence: "bad",
      },
      {
        kind: "smog",
        title: "Air Pollution Kills 12,000/yr",
        body: "A 2023 Lancet Planetary Health study attributed approximately 12,000 premature deaths annually in Delhi to PM2.5 air pollution - equivalent to 33 deaths per day. Children in Delhi show lung function 30–40% lower than WHO norms (Chhabra et al. 2021), causing life-long health deficits.",
        valence: "bad",
      },
    ],

    // Stage 6 - State of the Sector 2/5
    [
      {
        kind: "crane",
        title: "Metro: 390 km Network",
        body: "Delhi Metro Rail Corporation (DMRC) operates 390 km on 12 lines - the 5th longest metro network in the world. Phase IV added 65 km from 2020–2025. The metro carries 5.5 million daily riders, has reduced Delhi's CO₂ by an estimated 630,000 tonnes/year, and won UN Environment Awards.",
        valence: "good",
      },
      {
        kind: "flag",
        title: "Smart City Mission",
        body: "Delhi NCR cities including Gurugram and Noida participate in India's Smart Cities Mission (2015–2024), attracting ₹6,400 crore in central investment. Projects include integrated traffic management, LED street lighting, and CCTV networks across the capital region.",
        valence: "good",
      },
      {
        kind: "factory",
        title: "Power Cuts Still Common",
        body: "Despite improvement, Delhi's power distribution network suffered over 8,000 recorded outages in 2022 (DERC Annual Report), many lasting hours. Peak summer demand repeatedly exceeds grid capacity; transformer failures in densely wired unauthorized colonies are routine.",
        valence: "bad",
      },
      {
        kind: "drop",
        title: "Water Crisis: 40% Deficit",
        body: "The Delhi Jal Board supplies only 935 million gallons per day against a demand of 1,140 MGD - a 40% deficit (2023). Over 3 million Delhi residents receive water for fewer than 4 hours per day, relying on costly private tankers. Non-revenue water loss exceeds 40% due to ageing pipes.",
        valence: "bad",
      },
    ],

    // Stage 7 - Income and Wealth 2/5
    [
      {
        kind: "dollar",
        title: "GDP per Capita Rising Fast",
        body: "Delhi's GSDP per capita reached ₹4.61 lakh (~USD 5,540) in 2022–23, the highest of any Indian state or UT and growing at 9% annually. This reflects concentration of high-value services, government, and trade, and places Delhi far above India's national average of ~₹1.7 lakh.",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "Female Labour Force Rising",
        body: "Delhi's female labour force participation rate improved from 10% to 16% between 2017 and 2022 (PLFS), driven by growth in apparel, domestic service, and gig economy platform work. Government-run 'Rozgar Bazaar' matched 150,000 job seekers in its first year (2020).",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "40% Below Poverty Line",
        body: "Approximately 40% of Delhi's population - concentrated in JJ clusters (jhuggi-jhonpri informal settlements, housing ~3 million people) and resettlement colonies - lives on incomes below a meaningful poverty line. The bottom quintile spends over 60% of income on food and rent.",
        valence: "bad",
      },
      {
        kind: "factory",
        title: "Informal Sector Dominates",
        body: "Over 70% of Delhi's economic output is produced by small and micro enterprises, many unregistered. The GST and demonetisation of 2016 severely disrupted informal trade; a 2022 survey of Old Delhi traders (ASSOCHAM) found 35% reported revenue still below 2016 levels.",
        valence: "bad",
      },
    ],

    // Stage 8 - Getting Around 2/5
    [
      {
        kind: "metro",
        title: "Delhi Metro: 5.5M Riders",
        body: "Delhi Metro carried a record 5.5 million passengers on its busiest day in 2023, making it one of Asia's most-used rapid transit systems. Its 99.7% on-time performance (DMRC 2023) and air-conditioned coaches make it by far the most reliable daily commute option in the city.",
        valence: "good",
      },
      {
        kind: "bike",
        title: "E-Rickshaw Fleet: 100,000+",
        body: "Delhi has over 100,000 registered e-rickshaws (electric cycle-rickshaws), the world's largest urban e-rickshaw fleet. They provide critical first/last-mile connectivity around metro stations, emit zero direct pollution, and support 200,000+ livelihoods in the gig and informal economies.",
        valence: "good",
      },
      {
        kind: "car",
        title: "11 Million Vehicles: Gridlock",
        body: "Delhi has over 11 million registered vehicles (VAHAN 2023) - more than Mumbai, Chennai, and Kolkata combined. Average CBD traffic speeds dropped to 18 km/h in peak hours (TomTom 2023). The odd-even vehicle rationing scheme, tried twice, produced only temporary relief.",
        valence: "bad",
      },
      {
        kind: "car",
        title: "Pedestrian Infrastructure Absent",
        body: "A 2022 WRI India survey of 1,200 Delhi intersections found 68% lacked functional pedestrian crossings and 74% had pavements blocked by encroachments. Delhi's road fatality rate of 10.4 per 100,000 (2022, MoRTH) is double London's; pedestrians and cyclists account for 60% of deaths.",
        valence: "bad",
      },
    ],

    // Stage 9 - Housing 2/5
    [
      {
        kind: "house",
        title: "PM Awas Yojana Units",
        body: "Under the Pradhan Mantri Awas Yojana (Urban) scheme, over 70,000 affordable housing units were sanctioned in Delhi-NCR between 2015 and 2023, with subsidies up to ₹2.67 lakh per beneficiary. The Delhi Development Authority (DDA) launched its 2023 Housing Scheme with 32,000 flats.",
        valence: "good",
      },
      {
        kind: "crane",
        title: "Plotted Development Affordable",
        body: "Peripheral Delhi-NCR areas - Faridabad, Greater Noida, Ghaziabad - offer plotted residential properties from ₹15–30 lakh (~USD 18,000–36,000), providing formal ownership accessible to middle-income families. Land-pooling reforms (2021) aim to streamline legal development of fringe land.",
        valence: "good",
      },
      {
        kind: "house",
        title: "3 Million in JJ Clusters",
        body: "Approximately 3 million people live in 675 recognised jhuggi-jhonpri clusters across Delhi - informal settlements with insecure tenure, inadequate water, and minimal sanitation (Delhi Urban Shelter Improvement Board 2022). Demolitions for infrastructure projects regularly displace residents without adequate resettlement.",
        valence: "bad",
      },
      {
        kind: "drop",
        title: "Unauthorised Colonies: 1,731",
        body: "Delhi has 1,731 officially listed unauthorised colonies housing an estimated 5–7 million people (DDA 2022). While the PM Uday Scheme (2019) regularised 1,731 colonies, residents still lack proper title deeds, struggle to access bank loans, and face demolition threats under various orders.",
        valence: "bad",
      },
    ],

    // Stage 10 - Safety 2/5
    [
      {
        kind: "flag",
        title: "Policing Visibility High",
        body: "Delhi Police operates 214 police stations with over 84,000 officers - one of South Asia's largest city police forces per capita. Deployment of PCR (Police Control Room) vans in every district ensures response times that, while variable, are among the best in India.",
        valence: "good",
      },
      {
        kind: "hospital",
        title: "Emergency Response Network",
        body: "Delhi's 112 emergency hotline (unified police, fire, medical dispatch) handles over 80,000 calls per month. The Centralised Accident and Trauma Services (CATS) ambulance fleet completed 85,000 free emergency transfers in 2022, providing equity of access for road trauma victims.",
        valence: "good",
      },
      {
        kind: "flag",
        title: "Gender Violence Crisis",
        body: "Delhi recorded 14,158 crimes against women in 2022 (NCRB) - the highest of any Indian city - including 1,716 reported rapes. The 2012 Nirbhaya gang-rape catalysed national reforms, but conviction rates remain at 27%, and women consistently rank Delhi among India's most dangerous cities for gender safety.",
        valence: "bad",
      },
      {
        kind: "dollar",
        title: "Communal Tension Incidents",
        body: "Delhi experienced serious communal riots in February 2020 in northeast districts (53 killed, 200+ mosques and temples damaged). The National Crime Records Bureau 2022 data shows Delhi leads India in 'communal and riots' incidents, reflecting political and demographic tensions in one of India's most diverse cities.",
        valence: "bad",
      },
    ],

    // Stage 11 - Smog BOSS 1/5
    [
      {
        kind: "leaf",
        title: "Delhi Tree Authority Act",
        body: "Delhi's Preservation of Trees Act mandates permission for felling any tree with a girth over 0.6 m. The Delhi Tree Authority (2022) approved compensatory planting of 10 trees per felled tree and conducted a 2023 urban tree census covering 7 million trees in 280 municipal wards.",
        valence: "good",
      },
      {
        kind: "solar",
        title: "Solar Rooftop Rollout",
        body: "Delhi installed 230 MW of rooftop solar capacity by 2023 under the Mukhyamantri Solar Power Scheme, which provides subsidies up to ₹2/watt. Reduced electricity bills of ₹800–2,000/month have been documented for households installing 2 kW systems in East Delhi colonies.",
        valence: "good",
      },
      {
        kind: "smog",
        title: "World's Most Polluted Capital",
        body: "Delhi ranked as the world's most polluted capital city in IQAir's 2023 World Air Quality Report, with an annual average PM2.5 of 92.7 μg/m³ - 18.5 times the WHO guideline of 5 μg/m³. The city exceeded AQI 400 ('Severe') on 26 days in November 2023 alone.",
        valence: "bad",
      },
      {
        kind: "factory",
        title: "Stubble Burning Drives Peaks",
        body: "Agricultural stubble burning in Punjab and Haryana contributes 30–40% of Delhi's worst winter pollution episodes (SAFAR-India 2023). Despite India's National Green Tribunal banning the practice in 2018, over 50,000 fire events are satellite-detected each October–November, as farmers lack affordable alternatives.",
        valence: "bad",
      },
    ],
  ],

  // ─────────────────────────────────────────────
  // LAGOS  (difficulty 0.95)
  // ─────────────────────────────────────────────
  lagos: [
    // Stage 1 - Arts, Culture & Recreation 4/5
    [
      {
        kind: "plaque",
        title: "Afrobeats Global HQ",
        body: "Lagos is the birthplace and global capital of Afrobeats: artists including Burna Boy, Wizkid, and Davido - all Lagos-based - generated over USD 100 million in streaming and concert revenue in 2023. The genre's global reach has made Nigerian music a leading cultural export, surpassing oil in some soft-power metrics.",
        valence: "good",
      },
      {
        kind: "temple",
        title: "Nollywood: 2,500 Films/yr",
        body: "Lagos's Nollywood is the world's 2nd-largest film industry by output (2,500+ films annually) and 3rd by revenue, after Hollywood and Bollywood. Netflix's 2016 entry into Nollywood - and its USD 15 million original production fund for Nigeria - has elevated production values globally.",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "Art Week Cost Barrier",
        body: "Lagos Art Week and Arthouse Contemporary auctions have positioned the city as Africa's leading fine-art market. However, ticket prices (₦50,000–200,000, or USD 30–120 at 2024 rates) price out most Lagosians on minimum wage (₦70,000/month), creating an elite art enclave.",
        valence: "bad",
      },
      {
        kind: "flag",
        title: "Public Spaces Deficient",
        body: "Lagos has approximately 0.4 m² of public green or recreational space per resident - well below the UN-Habitat recommended 9 m² (Lagos State Physical Planning Authority 2023). The few public beaches (Elegushi, Bar Beach) are privatised; most residents in mainland slums have no accessible park within 1 km.",
        valence: "bad",
      },
    ],

    // Stage 2 - Work 2/5
    [
      {
        kind: "factory",
        title: "Sub-Saharan Africa's Largest Economy",
        body: "Lagos State alone generates approximately 30% of Nigeria's GDP - roughly USD 136 billion in 2022 (Lagos State Government data). The city is home to the Nigerian Stock Exchange, the headquarters of 65% of Nigeria's top 100 companies, and West Africa's largest port (Apapa).",
        valence: "good",
      },
      {
        kind: "market",
        title: "Entrepreneurial Culture Thrives",
        body: "Lagos's informal and formal entrepreneurship is remarkable: Alaba International Market (electronics), Balogun Market (textiles), and Oshodi (foodstuffs) together turn over billions of USD annually. Fintech start-ups including Flutterwave (USD 3 billion valuation, 2022) and Paystack (acquired by Stripe for USD 200 million) emerged from Lagos.",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "Unemployment Rate: 34%",
        body: "Lagos's unemployment and underemployment rate reached 34% in 2022 (NBS), concentrated among youth aged 15–35. Approximately 600,000 new workers enter the Lagos labour market each year, but formal job creation runs at roughly 150,000 positions annually - a structural deficit.",
        valence: "bad",
      },
      {
        kind: "factory",
        title: "Power Cuts 18 hrs/day Average",
        body: "Lagos businesses lose an average of 18 hours of grid power per day (World Bank Enterprise Survey 2023), forcing reliance on diesel generators that cost 5–8x grid tariffs and emit toxic fumes. Power unreliability costs Nigerian businesses an estimated USD 29 billion per year in lost productivity.",
        valence: "bad",
      },
    ],

    // Stage 3 - Civic Engagement 2/5
    [
      {
        kind: "vote",
        title: "#EndSARS Movement 2020",
        body: "The October 2020 #EndSARS protests - the largest Nigerian civil uprising in a generation - originated in Lagos and saw hundreds of thousands demonstrate against police brutality. The movement forced the formal disbandment of the Special Anti-Robbery Squad and showcased remarkable youth-led digital civic organisation.",
        valence: "good",
      },
      {
        kind: "flag",
        title: "Active Civil Society Orgs",
        body: "Lagos hosts over 1,000 registered civil society organisations working on women's rights, climate justice, and digital rights. Groups like the Enough is Enough Coalition and BudgIT (which has made Nigeria's federal budget accessible to 3 million readers) represent a vibrant accountability ecosystem.",
        valence: "good",
      },
      {
        kind: "vote",
        title: "2023 Election Turnout: 22%",
        body: "Nigeria's February 2023 presidential election saw just 22% voter turnout nationally, the lowest since the return of democracy in 1999 (INEC). In Lagos, results were disputed due to widespread reports of BVAS malfunction, violence, and results collation irregularities - compounding voter disillusionment.",
        valence: "bad",
      },
      {
        kind: "flag",
        title: "Lekki Toll Gate Killing",
        body: "On 20 October 2020, security forces opened fire on peaceful #EndSARS protesters at Lekki Toll Gate; the Lagos Judicial Panel (2021) found soldiers killed 9–12 protesters and wounded dozens more. No prosecutions followed, severely damaging public trust in the state government.",
        valence: "bad",
      },
    ],

    // Stage 4 - Learning 2/5
    [
      {
        kind: "school",
        title: "University of Lagos Top 10 Africa",
        body: "The University of Lagos (UNILAG), established 1962, consistently ranks among Africa's top 10 universities (Times Higher Education Africa Rankings 2023). Its engineering, law, and business faculties produce graduates recruited by multinationals across West Africa.",
        valence: "good",
      },
      {
        kind: "book",
        title: "Tech Bootcamp Ecosystem",
        body: "Lagos is Africa's leading tech training hub: Andela (founded 2014, Lagos), Semicolon Africa, and AltSchool have collectively trained over 15,000 African software engineers, with graduates placed at Google, Microsoft, and local fintechs. Cohort fees of USD 0–2,000 (often income-share) increase access.",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "ASUU Strike: 8 Months Lost",
        body: "The Academic Staff Union of Universities (ASUU) industrial action from February to October 2022 - the longest in Nigerian history - closed all federal universities for 8 months, disrupting 1.5 million students. The dispute centred on 13 years of unfulfilled government salary and infrastructure promises.",
        valence: "bad",
      },
      {
        kind: "school",
        title: "30% of Schools Lack Toilets",
        body: "A 2022 UNICEF Nigeria survey found 30% of Lagos public primary schools lack functional toilets, and 44% have no access to clean drinking water on-site. Teacher absenteeism in public schools averages 25% (World Bank 2022), driven by poor pay (average NGN 45,000/month, ~USD 28) and long commutes.",
        valence: "bad",
      },
    ],

    // Stage 5 - Income and Wealth 1/5
    [
      {
        kind: "dollar",
        title: "Nigeria's Largest Consumer Market",
        body: "Lagos is Africa's most important retail and consumer market: it hosts 40% of Nigeria's middle class (defined as household spending > USD 5.50/day PPP) and generates over NGN 24 trillion in consumption annually. Mall and e-commerce sectors grew 18% in 2022 despite macroeconomic stress.",
        valence: "good",
      },
      {
        kind: "market",
        title: "Dangote: Africa's Richest",
        body: "Aliko Dangote - the world's wealthiest Black person (USD 19.6 billion, Forbes 2024) - is based in Lagos and employs over 30,000 people through Dangote Cement, Sugar, and his landmark 650,000 bpd Dangote Refinery (commissioned 2024), the largest single-train refinery ever built.",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "63% in Multidimensional Poverty",
        body: "The Nigerian National Bureau of Statistics 2022 Multidimensional Poverty Index found 63% of Nigerians (133 million people) are multidimensionally poor. In Lagos, the poverty rate is lower (~26%) but still represents over 5 million residents lacking access to health, education, and adequate housing simultaneously.",
        valence: "bad",
      },
      {
        kind: "dollar",
        title: "Naira Lost 70% in 2023",
        body: "Following the CBN's June 2023 forex unification, the naira fell from NGN 460 to NGN 1,600+ per USD by early 2024 - a 70%+ devaluation. Food inflation exceeded 37% by year-end 2023, and real incomes for salaried workers collapsed, triggering the worst cost-of-living crisis in a generation.",
        valence: "bad",
      },
    ],

    // Stage 6 - State of the Sector 1/5
    [
      {
        kind: "crane",
        title: "Blue Line Rail Opens 2023",
        body: "Lagos opened Phase 1 of its Blue Line metro rail in June 2023 - the first rail transit in Nigeria in over 50 years. The 13-km Marina–National Theatre segment, built at a cost of USD 1.2 billion, carries up to 150,000 daily passengers and marks a historic infrastructure milestone.",
        valence: "good",
      },
      {
        kind: "flag",
        title: "LASG Tax Revenue Rising",
        body: "Lagos State generated NGN 763 billion in internally generated revenue in 2022 (LIRS), the highest of any Nigerian state - 4x its 2015 level. This growing fiscal base has funded road expansions, social housing, and the Lagos BRT network serving 500,000 daily commuters.",
        valence: "good",
      },
      {
        kind: "drop",
        title: "Widespread Power Failure",
        body: "Lagos is served by a national grid that frequently operates at 10–30% of installed capacity. Most neighbourhoods experience 18+ hours of daily blackouts; hospitals, schools, and water utilities depend on diesel generators, with fuel costs consuming 20–40% of operational budgets.",
        valence: "bad",
      },
      {
        kind: "factory",
        title: "Corruption Index: 25/100",
        body: "Nigeria scored 25/100 on Transparency International's 2023 CPI - 145th out of 180 countries - reflecting pervasive bribery in police, judiciary, and public contracting. The EFCC estimates Nigeria loses USD 18 billion per year to corruption, hollowing out infrastructure and social service delivery.",
        valence: "bad",
      },
    ],

    // Stage 7 - Health 1/5
    [
      {
        kind: "hospital",
        title: "Private Sector Innovation",
        body: "Lagos hosts Africa's most dynamic private healthcare market: Lifestores Pharmacy (60+ outlets), Docsmart telemedicine (300,000 registered users), and MDaaS Global (radiography as a service) represent a new wave of tech-enabled health access reaching urban poor communities.",
        valence: "good",
      },
      {
        kind: "hospital",
        title: "Lagos University Teaching Hospital",
        body: "LUTH, established 1962, is Nigeria's largest teaching hospital with 761 beds and 80+ departments. Despite chronic underfunding, it trains 40% of Nigeria's medical specialists and its oncology and cardiology departments perform procedures unavailable elsewhere in West Africa.",
        valence: "good",
      },
      {
        kind: "dollar",
        title: "Healthcare Spending: USD 25/person",
        body: "Nigeria's government health expenditure is approximately USD 25 per person per year (World Bank 2022) - among the world's lowest, and far below the USD 86 WHO threshold for basic services. This forces 95% of Lagosians to rely on out-of-pocket payments, causing catastrophic costs for serious illness.",
        valence: "bad",
      },
      {
        kind: "hospital",
        title: "Maternal Mortality: 512/100,000",
        body: "Nigeria's maternal mortality ratio stands at 512 per 100,000 live births (WHO 2020) - one of the world's highest - and Lagos, despite being the wealthiest state, still records roughly 280 per 100,000. Haemorrhage, eclampsia, and obstructed labour remain leading causes, largely preventable with basic obstetric care.",
        valence: "bad",
      },
    ],

    // Stage 8 - Housing 1/5
    [
      {
        kind: "house",
        title: "Makoko Floating School",
        body: "Makoko - a waterfront community of 100,000–250,000 people built on stilts over Lagos Lagoon - represents adaptive vernacular architecture refined over 200 years. NLÉ Architects' 2013 Makoko Floating School prototype, though later destroyed by storms, inspired global debate on climate-adaptive housing for informal urban communities.",
        valence: "good",
      },
      {
        kind: "crane",
        title: "Eko Atlantic City",
        body: "Eko Atlantic - a 10 km² planned city reclaimed from the Atlantic Ocean, begun 2008 - represents a USD 6 billion private investment in premium residential and commercial real estate. Its 400,000-tonne 'Great Wall of Lagos' sea barrier also protects Victoria Island from coastal erosion.",
        valence: "good",
      },
      {
        kind: "house",
        title: "Housing Deficit: 17 Million Units",
        body: "Nigeria faces a national housing deficit of approximately 17 million units (Ministry of Works and Housing 2022), the largest in Africa. In Lagos alone, over 70% of residents live in informal or substandard housing, with an estimated 800,000 people in waterfront communities lacking legal tenure.",
        valence: "bad",
      },
      {
        kind: "drop",
        title: "Badia East Demolitions",
        body: "Lagos State Government demolished the Badia East community in 2013 and again threatened demolitions in 2019–2022, displacing 9,000+ people with less than 48 hours notice and no adequate resettlement. The UN Committee on Economic, Social and Cultural Rights cited these actions as violations of the right to adequate housing.",
        valence: "bad",
      },
    ],

    // Stage 9 - Environment 1/5
    [
      {
        kind: "drop",
        title: "Mangrove Conservation Effort",
        body: "Lagos State's 2022 Mangrove Restoration Initiative aims to replant 5,000 hectares of degraded mangrove along the Lagos coastline by 2030. Mangroves sequester carbon at 5x the rate of tropical forests and provide storm surge protection equivalent to a 1-metre sea wall.",
        valence: "good",
      },
      {
        kind: "recycle",
        title: "Wecyclers Waste Innovation",
        body: "Lagos-based social enterprise Wecyclers has collected over 1,200 tonnes of recyclable waste from 30,000+ low-income households using cargo bicycles and an SMS reward system. It has prevented over 750 tonnes of plastic from entering Lagos's waterways and earned 2 million households reward points redeemable for food.",
        valence: "good",
      },
      {
        kind: "smog",
        title: "Open Dumping Crisis",
        body: "Lagos generates approximately 13,000 tonnes of solid waste per day but its Ramos and Olusosun landfills have been over capacity since 2010 (Lagos State Waste Management Authority). An estimated 40% of daily waste is dumped in open drains, canals, and roadsides, blocking flood channels and contaminating water.",
        valence: "bad",
      },
      {
        kind: "drop",
        title: "Annual Flooding Displaces Millions",
        body: "Lagos experiences severe annual flooding during the June–September rainy season: in 2022, floods displaced over 1.5 million people across the state (NEMA). Rising sea levels (3.5 mm/year) and subsidence (up to 3 cm/year in Victoria Island) mean the city faces existential flooding risk within decades.",
        valence: "bad",
      },
    ],

    // Stage 10 - Safety 1/5
    [
      {
        kind: "flag",
        title: "Neighbourhood Watch Culture",
        body: "Lagos's Neighbourhood Safety Corps and local vigilante groups (known as 'Oodua People's Congress' in some areas) supplement police in high-density communities. In Alimosho and Ikorodu, community-funded watch programmes reduced house-break-ins by an estimated 30% in 2021–22 (Lagos State Security Trust Fund).",
        valence: "good",
      },
      {
        kind: "hospital",
        title: "Rapid Response Squad",
        body: "The Lagos State Rapid Response Squad (RRS), launched 2004, operates 24/7 with 500+ officers and a command-and-control room tracking crime across the state. In 2022 RRS made 12,000+ arrests and recovered 400+ stolen vehicles, providing a visible deterrent in major commercial districts.",
        valence: "good",
      },
      {
        kind: "flag",
        title: "Armed Robbery Prevalent",
        body: "The US State Department's 2024 Travel Advisory rates Lagos at Level 2 (Exercise Increased Caution) due to crime, including armed robbery, carjacking, and kidnapping for ransom - particularly on the Lagos-Benin Expressway. One-way motorists are vulnerable during traffic paralysis (known locally as 'go-slow').",
        valence: "bad",
      },
      {
        kind: "dollar",
        title: "Police-to-Resident Ratio: 1:2,000",
        body: "Nigeria's police force has approximately 1 officer per 2,000 residents (NPF 2022) - the UN recommends 1:450. In Lagos, an estimated 50% of police posts are understaffed and officers frequently solicit bribes at checkpoints rather than responding to crime; a 2021 survey found 74% of Lagosians paid a bribe to police in the prior year.",
        valence: "bad",
      },
    ],

    // Stage 11 - Gridlock/Inequality BOSS 1/5
    [
      {
        kind: "metro",
        title: "BRT: 500,000 Daily Riders",
        body: "The Lagos BRT-Lite scheme - Africa's first formal bus rapid transit system (launched 2008) - now carries 500,000 passengers daily along the 22-km Ikorodu–CMS corridor. Its dedicated lanes, prepaid cards, and formal stops represent a transformative improvement over chaotic danfo buses.",
        valence: "good",
      },
      {
        kind: "ferry",
        title: "Water Transport Revival",
        body: "The Lagos Ferry Service operates 14 routes connecting the mainland to Lagos Island, carrying over 100,000 daily passengers. Government subsidies keep fares at NGN 400–800 (~USD 0.25–0.50) - far cheaper than road transport - making it a critical low-income commuter route across the lagoon.",
        valence: "good",
      },
      {
        kind: "car",
        title: "Apapa Port Gridlock: 72-hr Queues",
        body: "Congestion around Apapa port - handling 70% of Nigeria's containerised trade - causes truck queues stretching 57+ km on some days. The gridlock costs Nigerian businesses an estimated USD 2 billion annually in demurrage, spoilage, and fuel idling (Manufacturers Association of Nigeria 2023). Despite e-call-up systems (2021), the bottleneck persists.",
        valence: "bad",
      },
      {
        kind: "dollar",
        title: "Gini: 0.49 - Extreme Gap",
        body: "Nigeria's Gini coefficient is 0.49 (World Bank 2018–20), placing it among Africa's most unequal economies. In Lagos this manifests as islands of ultra-wealth (Ikoyi, Victoria Island) minutes from some of Africa's most overcrowded slums (Ajegunle, Makoko). The top 2% own more than the bottom 55% combined.",
        valence: "bad",
      },
    ],
  ],
};
