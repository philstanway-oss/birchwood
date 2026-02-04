from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class SiteInfo(BaseModel):
    title: str
    description: str
    features: List[str]
    
class CampingInfo(BaseModel):
    id: str = Field(default="camping_info")
    title: str
    description: str
    facilities: List[str]
    pitchTypes: List[str]
    pricing: dict
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class FishingInfo(BaseModel):
    id: str = Field(default="fishing_info")
    title: str
    description: str
    species: List[str]
    dayTicketPrice: str
    rules: List[str]
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class GalleryImage(BaseModel):
    id: str
    title: str
    description: Optional[str] = ""
    imageData: str  # base64
    category: str  # camping, fishing, facilities
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ContactInfo(BaseModel):
    id: str = Field(default="contact_info")
    phone: str
    email: str
    address: str
    latitude: float
    longitude: float
    facebook: Optional[str] = ""
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Rule(BaseModel):
    id: str
    title: str
    description: str
    category: str  # general, camping, fishing
    order: int

# Initialize default data
async def init_default_data():
    # Check if data exists
    camping_exists = await db.camping_info.find_one({"id": "camping_info"})
    if not camping_exists:
        camping_data = CampingInfo(
            title="Camping at Birchwood",
            description="Welcome to Birchwood Fishing & Camping - a quiet, family-run campsite near Skegness, Lincolnshire. We offer a peaceful retreat with excellent facilities, perfect for families and pet owners.",
            facilities=[
                "Clean toilets and hot showers",
                "Washing up areas",
                "Electric hook-ups available",
                "Fresh water points",
                "Chemical disposal point",
                "Pet-friendly environment",
                "Safe for children",
                "Regular cleaning service"
            ],
            pitchTypes=[
                "Tent pitches",
                "Tourer pitches",
                "Motorhome pitches",
                "Up to 54 pitches available"
            ],
            pricing={
                "tent": "Contact for rates",
                "tourer": "Contact for rates",
                "motorhome": "Contact for rates",
                "note": "Prices vary by season and pitch type. Please contact us for current rates."
            }
        )
        await db.camping_info.insert_one(camping_data.dict())
    
    fishing_exists = await db.fishing_info.find_one({"id": "fishing_info"})
    if not fishing_exists:
        fishing_data = FishingInfo(
            title="Fishing at Birchwood",
            description="Enjoy course fishing at our well-stocked lake featuring a variety of species. Our peaceful fishing lake is perfect for both experienced anglers and beginners.",
            species=["Carp", "Rudd", "Roach", "Tench", "Bream"],
            dayTicketPrice="Day tickets available - contact for pricing",
            rules=[
                "Day tickets must be purchased before fishing",
                "Fishing from designated areas only",
                "Keep noise to a minimum",
                "Take all litter home",
                "Barbless hooks recommended",
                "Follow catch and release guidelines",
                "Children must be supervised"
            ]
        )
        await db.fishing_info.insert_one(fishing_data.dict())
    
    contact_exists = await db.contact_info.find_one({"id": "contact_info"})
    if not contact_exists:
        contact_data = ContactInfo(
            phone="07887 577338",
            email="info@birchwood-skegness.co.uk",
            address="Birchwood Fishing & Camping, Mill Lane, Skegness, Lincolnshire, PE25 1HW, UK",
            latitude=53.16737,
            longitude=0.31966,
            facebook="https://www.facebook.com/share/1AiuyXLNeF/"
        )
        await db.contact_info.insert_one(contact_data.dict())
    else:
        # Update existing contact info
        await db.contact_info.update_one(
            {"id": "contact_info"},
            {"$set": {
                "phone": "07887 577338",
                "address": "Birchwood Fishing & Camping, Mill Lane, Skegness, Lincolnshire, PE25 1HW, UK",
                "latitude": 53.16737,
                "longitude": 0.31966,
                "facebook": "https://www.facebook.com/share/1AiuyXLNeF/"
            }}
        )
    
    # Add default rules
    rules_exist = await db.rules.count_documents({})
    if rules_exist == 0:
        default_rules = [
            Rule(id="rule_1", title="Check-in/Check-out", description="Check-in from 2 PM, Check-out by 11 AM", category="general", order=1),
            Rule(id="rule_2", title="Quiet Hours", description="Please keep noise to a minimum between 10 PM and 8 AM", category="general", order=2),
            Rule(id="rule_3", title="Pets", description="Pets are welcome but must be kept on a lead and under control at all times", category="general", order=3),
            Rule(id="rule_4", title="Speed Limit", description="Maximum speed limit of 5 mph on site", category="camping", order=4),
            Rule(id="rule_5", title="Fires", description="No open fires. BBQs allowed but must be off the ground", category="camping", order=5),
            Rule(id="rule_6", title="Waste Disposal", description="Please use designated bins and keep the site clean", category="general", order=6),
        ]
        for rule in default_rules:
            await db.rules.insert_one(rule.dict())

@app.on_event("startup")
async def startup_event():
    await init_default_data()

# API Routes
@api_router.get("/")
async def root():
    return {"message": "Birchwood Camping & Fishing API"}

@api_router.get("/camping")
async def get_camping_info():
    camping = await db.camping_info.find_one({"id": "camping_info"})
    if camping:
        camping.pop("_id", None)
        return camping
    raise HTTPException(status_code=404, detail="Camping info not found")

@api_router.get("/fishing")
async def get_fishing_info():
    fishing = await db.fishing_info.find_one({"id": "fishing_info"})
    if fishing:
        fishing.pop("_id", None)
        return fishing
    raise HTTPException(status_code=404, detail="Fishing info not found")

@api_router.get("/contact")
async def get_contact_info():
    contact = await db.contact_info.find_one({"id": "contact_info"})
    if contact:
        contact.pop("_id", None)
        return contact
    raise HTTPException(status_code=404, detail="Contact info not found")

@api_router.get("/rules")
async def get_rules():
    rules = await db.rules.find().sort("order", 1).to_list(100)
    for rule in rules:
        rule.pop("_id", None)
    return rules

@api_router.get("/gallery")
async def get_gallery_images():
    images = await db.gallery.find().sort("created_at", -1).to_list(100)
    for image in images:
        image.pop("_id", None)
    return images

@api_router.get("/gallery/{category}")
async def get_gallery_by_category(category: str):
    images = await db.gallery.find({"category": category}).sort("created_at", -1).to_list(100)
    for image in images:
        image.pop("_id", None)
    return images

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
