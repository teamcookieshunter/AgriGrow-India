
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { projects } from './data';
import { Button } from "@/components/ui/button";
import { FilePlus, AtSign, CheckCircle, MapPin, Pencil, Share2, EyeOff } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import EditProfileDialog from "@/components/edit-profile-dialog";

export default function ProfilePage() {
    const isOwner = true;
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const ongoingProjects = projects.filter(p => p.status !== 'Completed');
    const completedProjects = projects.filter(p => p.status === 'Completed');

    const [user, setUser] = useState({
        fullName: 'Ram Singh',
        username: 'ram_s',
        avatarUrl: 'https://picsum.photos/seed/farmer/100/100',
        isVerified: true,
        state: 'Maharashtra, India'
    });
    
    useEffect(() => {
        const storedAvatar = localStorage.getItem('userAvatar');
        if (storedAvatar) {
            setUser(prevUser => ({...prevUser, avatarUrl: storedAvatar}));
        }
    }, []);


    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 4 * 1024 * 1024) { // 4MB limit
            toast({
              variant: 'destructive',
              title: 'File too large',
              description: 'Please upload an image smaller than 4MB.',
            });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUri = reader.result as string;
            setUser(prevUser => ({...prevUser, avatarUrl: dataUri}));
            try {
                // Also update the UserNav avatar by setting localStorage
                localStorage.setItem('userAvatar', dataUri);
                 window.dispatchEvent(new StorageEvent('storage', {
                    key: 'userAvatar',
                    newValue: dataUri
                }));
            } catch (error) {
                console.error("Failed to save avatar to localStorage:", error);
                 toast({
                    variant: 'destructive',
                    title: 'Could not save avatar',
                    description: 'There was an issue saving your profile picture.',
                });
            }
            toast({
                title: "Profile Picture Updated",
                description: "Your new profile picture has been set.",
            });
        };
        reader.readAsDataURL(file);
    };
    
    const handleProfileUpdate = (updatedData: { fullName: string; username: string; state: string; }) => {
        setUser(prevUser => ({...prevUser, ...updatedData}));
        toast({
            title: "Profile Updated",
            description: "Your information has been successfully updated.",
        });
    };

    return (
        <div className="space-y-8">
            <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
            />
            
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                             <div className="relative group">
                                <Avatar className="h-20 w-20 cursor-pointer" onClick={handleAvatarClick}>
                                    <AvatarImage src={user.avatarUrl} alt={user.fullName} data-ai-hint="farmer avatar" />
                                    <AvatarFallback>{user.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                 <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <Pencil className="h-6 w-6 text-white" />
                                </div>
                             </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <CardTitle className="text-3xl">{user.fullName}</CardTitle>
                                    {user.isVerified && (
                                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/50 dark:text-green-300 gap-1 pl-2 pr-3">
                                            <CheckCircle className="h-4 w-4" />
                                            Verified
                                        </Badge>
                                    )}
                                </div>
                                <CardDescription className="flex items-center gap-2 text-base mt-1">
                                    <AtSign className="h-4 w-4" /> {user.username}
                                </CardDescription>
                                <CardDescription className="flex items-center gap-2 text-base mt-1">
                                    <MapPin className="h-4 w-4" /> {user.state}
                                </CardDescription>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardFooter className="justify-end gap-2">
                     <Button variant="outline">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Profile
                    </Button>
                    {isOwner && (
                        <>
                            <Button onClick={() => setIsEditDialogOpen(true)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Profile
                            </Button>
                            <EditProfileDialog
                                isOpen={isEditDialogOpen}
                                onOpenChange={setIsEditDialogOpen}
                                user={user}
                                onSave={handleProfileUpdate}
                            />
                        </>
                    )}
                </CardFooter>
            </Card>

            {isOwner ? (
                <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">My Projects</h1>
                        <p className="text-muted-foreground">Track your ongoing and completed farming projects.</p>
                      </div>
                      <Link href="/farming" passHref>
                        <Button>
                            <FilePlus className="mr-2 h-4 w-4" />
                            Start New Project
                        </Button>
                      </Link>
                    </div>

                    <div className="space-y-8 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Ongoing Projects</CardTitle>
                                <CardDescription>Your current farming activities.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[200px]">Crop</TableHead>
                                            <TableHead>Start Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="w-[200px]">Progress</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {ongoingProjects.length > 0 ? ongoingProjects.map(project => (
                                            <TableRow key={project.id}>
                                                <TableCell className="font-medium">{project.crop}</TableCell>
                                                <TableCell>{project.startDate}</TableCell>
                                                <TableCell>
                                                    <Badge variant={project.status === 'On Track' ? 'default' : 'destructive'} className={project.status === 'On Track' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>{project.status}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Progress value={project.progress} className="h-2" />
                                                        <span className="text-xs text-muted-foreground">{project.progress}%</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center h-24">No ongoing projects. Start a new one today!</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Completed Projects</CardTitle>
                                <CardDescription>Your past harvests and project history.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[200px]">Crop</TableHead>
                                            <TableHead>Start Date</TableHead>
                                            <TableHead>End Date</TableHead>
                                            <TableHead>Yield</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                         {completedProjects.length > 0 ? completedProjects.map(project => (
                                            <TableRow key={project.id}>
                                                <TableCell className="font-medium">{project.crop}</TableCell>
                                                <TableCell>{project.startDate}</TableCell>
                                                <TableCell>{project.endDate}</TableCell>
                                                <TableCell>{project.yield}</TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center h-24">No completed projects yet.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center h-48 text-center border-2 border-dashed rounded-lg">
                            <EyeOff className="h-12 w-12 text-muted-foreground" />
                            <p className="mt-4 text-muted-foreground">This user's projects are private.</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

    
