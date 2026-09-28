export type TicketStatus = 'open' | 'progress' | 'deposit_pending' | 'booked' | 'ai_active' | 'closed';

export type TicketReason = 
  | 'booking_intent'
  | 'human_request'
  | 'complaint'
  | 'negative_experience'
  | 'safety'
  | 'out_of_catalog'
  | 'master_question';

export interface ServiceItem {
  id: string;
  name: string;
  category: 'hair' | 'coloring' | 'nails' | 'brows_lashes' | 'care';
  priceFrom: number;
  durationMin: number;
  description?: string;
  popular?: boolean;
}

export interface MasterItem {
  id: string;
  name: string;
  role: string;
  avatar: string;
  specialties: string[];
  priority: boolean;
  bookonId: string;
}

export interface DialogueMessage {
  id: string;
  author: 'client' | 'bot' | 'human';
  text: string;
  time: string;
  intent?: string;
}

export interface BookingState {
  serviceId?: string;
  serviceName?: string;
  masterId?: string;
  masterName?: string;
  date?: string;
  time?: string;
  durationMin?: number;
  depositRequired: boolean;
  depositAmount?: number;
  depositStatus?: 'none' | 'pending' | 'received' | 'not_needed';
  notes?: string;
  bookonSyncStatus?: 'synced' | 'pending' | 'manual_required';
}

export interface Ticket {
  id: string;
  conversationId: number;
  clientName: string;
  instagramHandle: string;
  instagramUrl: string;
  avatar?: string;
  status: TicketStatus;
  reason: TicketReason;
  reasonTitle: string;
  createdAt: string;
  minutesInQueue: number;
  assignedAdmin?: string;
  humanUntil?: string;
  dialogue: DialogueMessage[];
  booking: BookingState;
  crmNotes: string;
  aiSuggestedAction: string;
  lastClientMessage: string;
  vipStatus?: boolean;
}

export interface N8nWebhookPayload {
  event: 'take_conversation' | 'confirm_booking' | 'deposit_verified' | 'resume_bot' | 'send_direct_message' | 'update_booking';
  conversation_id: number;
  actor: {
    admin_name: string;
    telegram_user_id?: number;
  };
  timestamp: string;
  booking?: {
    service_id?: string;
    service_name?: string;
    master_name?: string;
    date?: string;
    time?: string;
    deposit_required?: boolean;
    deposit_amount?: number;
    deposit_status?: string;
  };
  message_to_client?: string;
}
