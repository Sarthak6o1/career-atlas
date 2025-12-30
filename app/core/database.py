from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class Database:
    client: AsyncIOMotorClient = None

    def connect(self):
        try:
            self.client = AsyncIOMotorClient(settings.MONGODB_URL)
            # Verify connection
            # self.client.admin.command('ping') 
            print("Connected to MongoDB")
        except Exception as e:
            print(f"Could not connect to MongoDB: {e}")

    def disconnect(self):
        if self.client:
            self.client.close()
            print("Disconnected from MongoDB")

    def get_db(self):
        if self.client is None:
             self.connect()
        return self.client[settings.DATABASE_NAME]

db = Database()
