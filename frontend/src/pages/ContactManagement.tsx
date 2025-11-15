import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  MessageSquare, 
  Trash2, 
  Search, 
  Mail, 
  User, 
  Calendar,
  Filter,
  ChevronDown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getContacts,
  deleteContact,
  updateContactStatus,
} from "../services/contactService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ContactManagement = () => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchAllContacts = async () => {
    try {
      const data = await getContacts();
      if (data.success) {
        setContacts(data.contacts);
        setFilteredContacts(data.contacts);
      } else {
        toast({ title: "Failed to fetch contacts", variant: "destructive" });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Unable to connect to server.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllContacts();
  }, []);

  // ✅ Search and status filter
  useEffect(() => {
    const q = search.toLowerCase();
    let filtered = contacts;

    // Apply search filter
    if (q) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.subject.toLowerCase().includes(q) ||
          c.message.toLowerCase().includes(q)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    setFilteredContacts(filtered);
  }, [search, contacts, statusFilter]);

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await deleteContact(id);
      toast({ title: "Message deleted successfully" });
      setContacts((prev) => prev.filter((c) => c._id !== id));
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  // ✅ Update status
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateContactStatus(id, newStatus);
      toast({ title: "Status updated" });
      setContacts((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, status: newStatus } : c
        )
      );
    } catch {
      toast({ title: "Failed to update status", variant: "destructive" });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "new": return "default";
      case "read": return "secondary";
      case "replied": return "secondary";
      default: return "outline";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800 border-blue-200";
      case "read": return "bg-gray-100 text-gray-800 border-gray-200";
      case "replied": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-lg text-slate-600">Loading messages...</p>
        </div>
      </div>
    );

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="h-7 w-7 text-primary" />
            Contact Messages
          </h1>
          <p className="text-slate-600 text-sm md:text-base">
            Manage and respond to customer inquiries
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Status: {statusFilter === "all" ? "All" : statusFilter}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                All Messages
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("new")}>
                New
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("read")}>
                Read
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("replied")}>
                Replied
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search Input */}
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 w-full"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Messages</p>
                <p className="text-2xl font-bold text-blue-900">{contacts.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">New Messages</p>
                <p className="text-2xl font-bold text-red-900">
                  {contacts.filter(c => c.status === "new").length}
                </p>
              </div>
              <div className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {contacts.filter(c => c.status === "new").length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Replied</p>
                <p className="text-2xl font-bold text-green-900">
                  {contacts.filter(c => c.status === "replied").length}
                </p>
              </div>
              <Mail className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Read</p>
                <p className="text-2xl font-bold text-purple-900">
                  {contacts.filter(c => c.status === "read").length}
                </p>
              </div>
              <User className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages List */}
      {filteredContacts.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <MessageSquare className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">
              No messages found
            </h3>
            <p className="text-slate-500">
              {search || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria" 
                : "No contact messages have been received yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:gap-6">
          {filteredContacts.map((contact) => (
            <Card 
              key={contact._id} 
              className={`transition-all duration-200 hover:shadow-md border-l-4 ${
                contact.status === "new" 
                  ? "border-l-blue-500 bg-blue-50/50" 
                  : contact.status === "replied"
                  ? "border-l-green-500"
                  : "border-l-gray-500"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <CardTitle className="text-lg md:text-xl text-slate-800">
                        {contact.subject}
                      </CardTitle>
                      <Badge 
                        variant={getStatusBadgeVariant(contact.status)}
                        className={`self-start sm:self-center px-2 py-1 text-xs font-medium ${getStatusColor(contact.status)}`}
                      >
                        {contact.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{contact.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <a 
                          href={`mailto:${contact.email}`} 
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {contact.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(contact.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 self-start">
                    <select
                      value={contact.status}
                      onChange={(e) =>
                        handleStatusChange(contact._id, e.target.value)
                      }
                      className={`border rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        contact.status === "new" 
                          ? "bg-blue-100 text-blue-800 border-blue-300" 
                          : contact.status === "replied"
                          ? "bg-green-100 text-green-800 border-green-300"
                          : "bg-gray-100 text-gray-800 border-gray-300"
                      }`}
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                    </select>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(contact._id)}
                      className="h-10 w-10 hover:scale-105 transition-transform"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="bg-white rounded-lg p-4 border">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {contact.message}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactManagement;