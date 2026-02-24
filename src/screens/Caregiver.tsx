import React from 'react';
import { motion } from 'motion/react';
import { User, Share2, Shield, Bell, MessageSquare, Heart, ChevronRight, QrCode, Link } from 'lucide-react';
import { Card, Button, Typography, cn } from '../components/UI';
import { MOCK_USER } from '../constants';

import { AuthUser } from '../types';

interface CaregiverScreenProps {
  caretaker: AuthUser | null;
}

export function CaregiverScreen({ caretaker }: CaregiverScreenProps) {
  return (
    <div className="space-y-6 pb-20">
      <div className="text-center space-y-2 mb-8">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-primary" />
        </div>
        <Typography variant="display" className="text-2xl">Caregiver Mode</Typography>
        <Typography variant="caption">Share your recovery journey with those who support you.</Typography>
      </div>

      {caretaker ? (
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                {caretaker.name[0]}
              </div>
              <div>
                <Typography variant="display">{caretaker.name}</Typography>
                <Typography variant="caption">Primary Caregiver</Typography>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="bg-gray-50 dark:bg-dark-surface">
                <MessageSquare className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="bg-gray-50 dark:bg-dark-surface">
                <Bell className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/5 dark:border-white/5">
            <div className="text-center">
              <Typography variant="display" className="text-xl">Connected</Typography>
              <Typography variant="caption">Status</Typography>
            </div>
            <div className="text-center border-l border-black/5 dark:border-white/5">
              <Typography variant="display" className="text-xl">Active</Typography>
              <Typography variant="caption">Monitoring</Typography>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-8 text-center space-y-4 border-dashed border-2 border-gray-200 dark:border-white/10 bg-transparent">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <Typography variant="display" className="text-xl">No Caregiver Connected</Typography>
            <Typography variant="caption" className="max-w-[200px] mx-auto block">Share your connection code with your caregiver to get started.</Typography>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        <Typography variant="display" className="text-lg">Sharing Controls</Typography>
        <div className="space-y-3">
          {[
            { icon: Shield, title: "Access Permissions", desc: "Manage whatSarah can see", color: "text-blue-500" },
            { icon: Share2, title: "Invite New Caregiver", desc: "Add another person to your team", color: "text-purple-500" },
            { icon: Heart, title: "Emergency Contact", desc: "Set primary contact for alerts", color: "text-warning" },
          ].map((item, i) => (
            <Card key={i} className="flex items-center gap-4 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className={cn("w-10 h-10 rounded-xl bg-gray-100 dark:bg-dark-surface flex items-center justify-center", item.color)}>
                <item.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <Typography className="font-medium">{item.title}</Typography>
                <Typography variant="caption">{item.desc}</Typography>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </Card>
          ))}
        </div>
      </div>

      <Card className="bg-primary text-white p-6 text-center space-y-4">
        <QrCode className="w-24 h-24 mx-auto opacity-90" />
        <div>
          <Typography variant="display" className="text-xl">Caregiver Quick Connect</Typography>
          <Typography variant="caption" className="text-white/70">Have your caregiver scan this code to instantly link accounts.</Typography>
        </div>
        <Button variant="ghost" className="w-full bg-white/10 hover:bg-white/20 text-white">
          <Link className="w-4 h-4 mr-2" />
          Copy Invite Link
        </Button>
      </Card>
    </div>
  );
}
