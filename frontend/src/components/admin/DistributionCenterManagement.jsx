
    import React, { useState, useEffect } from 'react';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Trash2, Edit, PlusCircle } from 'lucide-react';
    import { useToast } from "@/components/ui/use-toast";
    import {
      AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
      AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
    } from "@/components/ui/alert-dialog";
    import {
      Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose
    } from "@/components/ui/dialog";
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";

    const DISTRIBUTION_CENTERS_STORAGE_KEY = 'distributionCenters';

    const DistributionCenterManagement = () => {
      const [centers, setCenters] = useState([]);
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const [currentCenter, setCurrentCenter] = useState(null); // For editing
      const [formData, setFormData] = useState({ name: '', address: '', city: '', country: '', zipcode: '' });
      const { toast } = useToast();

      // Load centers from localStorage on mount
      useEffect(() => {
        const storedCenters = localStorage.getItem(DISTRIBUTION_CENTERS_STORAGE_KEY);
        if (storedCenters) {
          setCenters(JSON.parse(storedCenters));
        }
      }, []);

      // Save centers to localStorage whenever they change
      useEffect(() => {
        localStorage.setItem(DISTRIBUTION_CENTERS_STORAGE_KEY, JSON.stringify(centers));
      }, [centers]);

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };

      const resetForm = () => {
        setFormData({ name: '', address: '', city: '', country: '', zipcode: '' });
        setCurrentCenter(null);
      };

      const handleOpenDialog = (center = null) => {
        if (center) {
          setCurrentCenter(center);
          setFormData({ name: center.name, address: center.address, city: center.city, country: center.country, zipcode: center.zipcode || '' });
        } else {
          resetForm();
        }
        setIsDialogOpen(true);
      };

      const handleCloseDialog = () => {
        setIsDialogOpen(false);
        resetForm(); // Reset form on close
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.address || !formData.city || !formData.country || !formData.zipcode) {
          toast({ title: "Error", description: "Please fill all fields, including Zipcode.", variant: "destructive" });
          return;
        }

        if (currentCenter) {
          // Edit existing center
          setCenters(centers.map(c => c.id === currentCenter.id ? { ...c, ...formData } : c));
          toast({ title: "Success", description: "Distribution center updated." });
        } else {
          // Add new center
          const newCenter = { id: Date.now(), ...formData };
          setCenters([...centers, newCenter]);
          toast({ title: "Success", description: "Distribution center added." });
        }
        handleCloseDialog();
      };

      const handleDeleteCenter = (idToDelete) => {
        setCenters(centers.filter(center => center.id !== idToDelete));
        toast({ title: "Success", description: "Distribution center removed.", variant: "destructive" });
      };

      return (
        <Card className="glassmorphism">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Distribution Centers</CardTitle>
              <CardDescription>Manage locations where packages are processed.</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Center
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{currentCenter ? 'Edit' : 'Add'} Distribution Center</DialogTitle>
                  <DialogDescription>
                    {currentCenter ? 'Update the details for this center.' : 'Enter the details for the new center.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">Address</Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleInputChange} className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="city" className="text-right">City</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleInputChange} className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="country" className="text-right">Country</Label>
                    <Input id="country" name="country" value={formData.country} onChange={handleInputChange} className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="zipcode" className="text-right">Zipcode</Label>
                    <Input id="zipcode" name="zipcode" value={formData.zipcode} onChange={handleInputChange} className="col-span-3" required />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                       <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                    </DialogClose>
                    <Button type="submit">{currentCenter ? 'Save Changes' : 'Add Center'}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>{centers.length === 0 ? 'No distribution centers configured yet.' : 'List of distribution centers.'}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Zipcode</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {centers.map((center) => (
                  <TableRow key={center.id}>
                    <TableCell className="font-medium">{center.name}</TableCell>
                    <TableCell>{center.address}</TableCell>
                    <TableCell>{center.city}</TableCell>
                    <TableCell>{center.country}</TableCell>
                    <TableCell>{center.zipcode}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(center)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the distribution center "{center.name}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteCenter(center.id)} className="bg-destructive hover:bg-destructive/90">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      );
    };

    export default DistributionCenterManagement;
