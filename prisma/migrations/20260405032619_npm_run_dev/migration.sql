-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "volunteerInterests" JSONB NOT NULL DEFAULT '["Fundraising","Mentoring","Event Support","Administrative","Technical"]';
