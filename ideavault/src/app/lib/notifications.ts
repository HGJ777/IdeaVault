// src/lib/notifications.ts
import { supabase } from './supabase'

export const createNotification = async (
  userId: string,
  type: 'message' | 'idea_view' | 'contact' | 'system',
  title: string,
  message: string,
  relatedId?: string,
  relatedType?: string
) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert([{
        user_id: userId,
        type,
        title,
        message,
        related_id: relatedId,
        related_type: relatedType
      }])

    if (error) {
      console.error('Error creating notification:', error)
    }
  } catch (error) {
    console.error('Error creating notification:', error)
  }
}

// Specific notification creators
export const notifyNewMessage = async (recipientId: string, senderEmail: string, ideaTitle: string, messageId: string) => {
  await createNotification(
    recipientId,
    'message',
    'New Business Inquiry',
    `You received a new inquiry from ${senderEmail} about "${ideaTitle}"`,
    messageId,
    'message'
  )
}

export const notifyIdeaView = async (ownerId: string, ideaTitle: string, ideaId: string) => {
  await createNotification(
    ownerId,
    'idea_view',
    'Idea Viewed',
    `Someone viewed your idea "${ideaTitle}"`,
    ideaId,
    'idea'
  )
}

export const notifyContact = async (recipientId: string, senderEmail: string, ideaTitle: string) => {
  await createNotification(
    recipientId,
    'contact',
    'Contact Request',
    `${senderEmail} wants to contact you about "${ideaTitle}"`,
    undefined,
    'contact'
  )
}