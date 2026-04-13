"use client"

import * as React from "react"
import { Icon } from "@/components/ui/icon"
import { 
  AlertCircleIcon, 
  InformationCircleIcon,
  Flag01Icon
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export function SidebarFooterActions({ vehicleId }: { vehicleId: string }) {
  const [reportReason, setReportReason] = React.useState("");
  const [reportDetails, setReportDetails] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isReportOpen, setIsReportOpen] = React.useState(false);

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Report Submitted", {
        description: "Thank you for alerting us. We will review this listing shortly."
    });
    
    setIsSubmitting(false);
    setIsReportOpen(false);
  };

  const disclaimerText = "By using this website, you agree to our Terms and Conditions and Privacy Policy, and disclaim RentNowPk from any incorrect information provided by car rental companies or us.";

  return (
    <div className="grid grid-cols-2 gap-4 p-6 pt-0 pl-0">
        {/* REPORT LISTING */}
        <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="h-10 rounded-xl text-slate-600 font-medium text-[13px] hover:bg-slate-50 hover:text-slate-900 transition-all gap-2 px-3">
                    <Icon icon={Flag01Icon} size={14} />
                    Report Listing
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmitReport}>
                    <DialogHeader>
                        <DialogTitle>Report this listing</DialogTitle>
                        <DialogDescription>
                            Let us know what's wrong with this car or business.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="reason">Reason</Label>
                            <Select required onValueChange={setReportReason}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a reason" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="wrong_price">Incorrect Price</SelectItem>
                                    <SelectItem value="unavailable">Car Unavailable</SelectItem>
                                    <SelectItem value="fraud">Potential Fraud</SelectItem>
                                    <SelectItem value="wrong_specs">Incorrect Car Details</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="details">Additional Details</Label>
                            <Textarea 
                                id="details" 
                                placeholder="Please provide more info..." 
                                required
                                value={reportDetails}
                                onChange={(e) => setReportDetails(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="w-full font-bold bg-slate-900 hover:bg-black text-white py-6" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit Report"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

        {/* DISCLAIMER */}
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" className="h-10 rounded-xl text-slate-600 font-medium text-[13px] hover:bg-slate-50 hover:text-slate-900 transition-all gap-2 px-3">
                    <Icon icon={AlertCircleIcon} size={14} />
                    Disclaimer
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md p-0 overflow-y-auto flex flex-col">
                <div className="flex flex-col h-full bg-white">
                    <SheetHeader className="p-8 border-b border-slate-50">
                        <SheetTitle className="text-[18px] font-light text-[#4d4d4d]">Disclaimer</SheetTitle>
                    </SheetHeader>
                    <div className="p-8">
                        <p className="text-[14px] font-light text-[#4d4d4d] leading-relaxed italic">
                            "{disclaimerText}"
                        </p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    </div>
  )
}
